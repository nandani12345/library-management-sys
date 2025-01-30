import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  HStack,
  SimpleGrid,
  useToast,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { SearchIcon } from "@chakra-ui/icons";

export default function BorrowBook() {
  const [books, setBooks] = useState([]);
  const [borrowRecords, setBorrowRecords] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [borrowedBooksCount, setBorrowedBooksCount] = useState(0);
  const toast = useToast();
  const navigate = useNavigate();

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem("authT");
      if (!token) return;

      const res = await axios.get(`http://localhost:9000/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const booksData = res.data.book;

      // Fetch borrow records from backend
      const borrowedRes = await axios
        .get(`http://localhost:9000/borrowed-books`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .catch((error) => {
          if (error.response.status === 404) {
            console.error("Error fetching borrowed books:", error);
            toast({
              title: "Error",
              description:
                "Failed to load borrowed books. Please try again later.",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
            return { data: [] };
          } else {
            throw error;
          }
        });

      let borrowedBooks = [];
      if (Array.isArray(borrowedRes.data)) {
        borrowedBooks = borrowedRes.data.map((b) => b.id);
      } else if (borrowedRes.data.data) {
        borrowedBooks = borrowedRes.data.data.map((b) => b.id);
      }

      const borrowRecords = {};
      booksData.forEach((book) => {
        borrowRecords[book._id] = borrowedBooks.includes(book._id)
          ? "borrowed"
          : "available";
      });

      setBooks(booksData);
      setBorrowRecords(borrowRecords);
      setBorrowedBooksCount(borrowedBooks.length);
    } catch (error) {
      console.error("Error fetching books:", error);
      toast({
        title: "Error",
        description: "Failed to load books. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleBorrowBook = async (bookId) => {
    try {
      const token = localStorage.getItem("authT");
      if (!token) {
        toast({
          title: "Error",
          description: "You need to log in to borrow a book.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      if (borrowedBooksCount >= 3) {
        toast({
          title: "Limit Reached",
          description: "You cannot borrow more than 3 books.",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      await axios.post(
        `http://localhost:9000/borrowBook`,
        { bookId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({
        title: "Success",
        description: "Book has been borrowed.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      fetchBooks();
    } catch (err) {
      console.error("Error borrowing book:", err.response);
      toast({
        title: "Error",
        description:
          err.response?.data?.message || "An unexpected error occurred.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleReturnBook = async (bookId) => {
    try {
      const token = localStorage.getItem("authT");
      if (!token) {
        toast({
          title: "Error",
          description: "You need to log in to return a book.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      // Verify the book is actually borrowed
      const resBorrowed = await axios
        .get(`http://localhost:9000/borrowed-books`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .catch((error) => {
          if (error.response.status === 404) {
            console.error("Error fetching borrowed books:", error);
            toast({
              title: "Error",
              description:
                "Failed to load borrowed books. Please try again later.",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
            return { data: [] };
          } else {
            throw error;
          }
        });

      const borrowedBooks = resBorrowed.data.map((b) => b.id);
      if (!borrowedBooks.includes(bookId)) {
        toast({
          title: "Error",
          description: "You have not borrowed this book.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      await axios.post(
        `http://localhost:9000/returnBook`,
        { bookId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({
        title: "Success",
        description: "Book has been returned.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      fetchBooks();
    } catch (err) {
      console.error("Error returning book:", err.response);
      toast({
        title: "Error",
        description:
          err.response?.data?.message || "An unexpected error occurred.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.ISBN.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // Navigate to book details
  const Details = () => {
    navigate("/bookDetails");
  };

  const Back = () => {
    navigate("/");
  };

  return (
    <Box p={4} overflowX="hidden">
      <Text fontSize="3xl" color="darkgoldenrod">
        List of Books
        <Button
          onClick={Details}
          mx="10px"
          backgroundColor="gray.500"
          color="white"
        >
          Details
        </Button>
        <Button onClick={Back} mx="10px" backgroundColor="purple" color="white">
          Back
        </Button>
      </Text>
      <InputGroup mb={4}>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          type="text"
          placeholder="Search by title, author, or ISBN"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </InputGroup>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3}>
        {filteredBooks.map((book) => (
          <Box
            key={book._id}
            borderWidth="1px"
            borderRadius="lg"
            p={4}
            textAlign="left"
          >
            <Text fontSize="xl">{book.title}</Text>
            <Text>Author: {book.author}</Text>
            <Text>ISBN: {book.ISBN}</Text>
            <Text>Available Copies: {book.availableCopies}</Text>
            <Text>
              Status:{" "}
              <Text
                as="span"
                color={borrowRecords[book._id] === "borrowed" ? "red" : "green"}
              >
                {borrowRecords[book._id] === "borrowed"
                  ? "Borrowed"
                  : "Available"}
              </Text>
            </Text>
            <HStack spacing={4} mt={4}>
              <Button
                onClick={() => handleBorrowBook(book._id)}
                colorScheme="teal"
                isDisabled={
                  borrowRecords[book._id] === "borrowed" ||
                  borrowedBooksCount >= 3
                }
              >
                Borrow
              </Button>
              <Button
                onClick={() => handleReturnBook(book._id)}
                colorScheme="red"
                isDisabled={borrowRecords[book._id] !== "borrowed"}
              >
                Return
              </Button>
            </HStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
