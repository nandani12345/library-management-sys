import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  SimpleGrid,
  Text,
  useToast,
  Spinner,
} from "@chakra-ui/react";

export default function BorrowedBooks() {
  const [borrowedBooks, setBorrowedBooks] = useState([]); // State for borrowed books
  const [loading, setLoading] = useState(true); // State for loading
  const toast = useToast();

  // Fetch borrowed books
  const fetchBorrowedBooks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authT"); // Get the token from local storage
      const res = await axios.get(`http://localhost:9000/borrowed-books`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBorrowedBooks(res.data);
    } catch (error) {
      console.error("Error fetching borrowed books:", error);
      toast({
        title: "Error",
        description: "Failed to load borrowed books. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowedBooks(); // Call the function to fetch borrowed books on component mount
  }, []);

  if (loading) {
    return (
      <Box p={4} textAlign="center">
        <Spinner size="xl" />
        <Text>Loading borrowed books...</Text>
      </Box>
    );
  }

  return (
    <Box p={4} color="black" >
      <Text fontSize="3xl" color="darkgoldenrod" mb={4}>
        Your Borrowed Books Details...
      </Text>
      {borrowedBooks.length === 0 ? (
        <Text>No borrowed books found.</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          {borrowedBooks.map((book) => (
            <Box
              key={book.id}
              borderWidth="1px"
              borderRadius="lg"
              p={4}
              backgroundColor="white"
            >
              <Text fontWeight="bold">{book.title}</Text>
              <Box textAlign="left" px="10px">
              <Text>Author: {book.author}</Text>
              <Text fontWeight="bold">Borrowed On: {new Date(book.borrowDate).toLocaleDateString()}</Text>
              <Text>Status: {book.status}</Text>
              <Text fontWeight="bold">Return On: {new Date(book.borrowDate).toLocaleDateString()}</Text>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}