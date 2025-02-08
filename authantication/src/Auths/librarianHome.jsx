import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Heading,
  Button,
  ButtonGroup,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
  Spinner,
  useToast,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function LibrarianPanel() {
  const navigate = useNavigate();
  const toast = useToast();
  const [books, setBooks] = useState([]);
  const [bookID, setBookID] = useState("");
  const [bookData, setBookData] = useState({
    title: "",
    author: "",
    ISBN: "",
    availableCopies: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditing, setIsEditing] = useState(false);
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();

  const fetchAllBooks = async () => {
    try {
      const res = await axios.get(`https://library-management-sys-1o9f.onrender.com/all`);
      setBooks(res.data.book);
    } catch (error) {
      console.error("Error fetching books:", error);
      setError("Failed to load books. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBooks();
    AOS.init({
      duration: 1000,
      once: true,
    });
    return () => {
      AOS.refresh();
    };
  }, []);

  const handleView = (book) => {
    setBookID(book._id);
    setBookData({
      title: book.title,
      author: book.author,
      ISBN: book.ISBN,
      availableCopies: book.availableCopies,
    });
    setIsEditing(true);
    onOpen();
  };

  const deleteBook = async () => {
    try {
      const token = localStorage.getItem("authT");
      if (!token) {
        throw new Error("Authorization token is missing.");
      }

      if (!selectedBookId) {
        throw new Error("No book selected for deletion.");
      }

      await axios.delete(`https://library-management-sys-1o9f.onrender.com/${selectedBookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBooks((prevBooks) =>
        prevBooks.filter((book) => book._id !== selectedBookId)
      );

      toast({
        title: "Success",
        description: "Book deleted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      onDeleteClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setError(errorMessage);

      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      onDeleteClose();
    }
  };

  const handleEditBook = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authT");
      const res = await axios.put(`https://library-management-sys-1o9f.onrender.com/${bookID}`, bookData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast({
        title: "Success",
        description: res.data.msg || "Book has been updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setBookData({
        title: "",
        author: "",
        ISBN: "",
        availableCopies: "",
      });
      setIsEditing(false);
      fetchAllBooks();
      onClose();
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.msg || "Error updating book",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authT");
      const res = await axios.post(`https://library-management-sys-1o9f.onrender.com/add`, bookData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({
        title: "Success",
        description: res.data.msg || "Book has been added.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setBookData({
        title: "",
        author: "",
        ISBN: "",
        availableCopies: "",
      });
      fetchAllBooks();
      onAddClose();
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.msg || "Error adding book",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Heading as="h2" size="md" textAlign="center" mb="6">
        Librarian Panel
      </Heading>
      <Button colorScheme="teal" onClick={onAddOpen} mb="4">
        Add New Book
      </Button>
      
      {loading ? (
        <Spinner size="xl" />
      ) : (
        <Table variant="striped" colorScheme="teal">
          <TableCaption>List of Books</TableCaption>
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Author</Th>
              <Th>ISBN</Th>
              <Th>Available Copies</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {books.map((book) => (
              <Tr key={book._id}>
                <Td>{book.title}</Td>
                <Td>{book.author}</Td>
                <Td>{book.ISBN}</Td>
                <Td>{book.availableCopies}</Td>
                <Td>
                  <ButtonGroup spacing="2">
                    <Button
                      variant="solid"
                      colorScheme="blue"
                      onClick={() => handleView(book)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="solid"
                      colorScheme="red"
                      onClick={() => {
                        setSelectedBookId(book._id);
                        onDeleteOpen();
                      }}
                    >
                      Delete
                    </Button>
                  </ButtonGroup>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
      <Modal isOpen={isAddOpen} onClose={onAddClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Book</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                value={bookData.title}
                onChange={(e) =>
                  setBookData({ ...bookData, title: e.target.value })
                }
              />
              <FormLabel>Author</FormLabel>
              <Input
                value={bookData.author}
                onChange={(e) =>
                  setBookData({ ...bookData, author: e.target.value })
                }
              />
              <FormLabel>ISBN</FormLabel>
              <Input
                value={bookData.ISBN}
                onChange={(e) =>
                  setBookData({ ...bookData, ISBN: e.target.value })
                }
              />
              <FormLabel>Available Copies</FormLabel>
              <Input
                value={bookData.availableCopies}
                onChange={(e) =>
                  setBookData({
                    ...bookData,
                    availableCopies: e.target.value,
                  })
                }
              />
             
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddBook}>
              Add Book
            </Button>
            <Button onClick={onAddClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog isOpen={isOpen} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Edit Book</AlertDialogHeader>
            <AlertDialogBody>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input
                  value={bookData.title}
                  onChange={(e) =>
                    setBookData({ ...bookData, title: e.target.value })
                  }
                />
                <FormLabel>Author</FormLabel>
                <Input
                  value={bookData.author}
                  onChange={(e) =>
                    setBookData({ ...bookData, author: e.target.value })
                  }
                />
                <FormLabel>ISBN</FormLabel>
                <Input
                  value={bookData.ISBN}
                  onChange={(e) =>
                    setBookData({ ...bookData, ISBN: e.target.value })
                  }
                />
                <FormLabel>Available Copies</FormLabel>
                <Input
                  value={bookData.availableCopies}
                  onChange={(e) =>
                    setBookData({
                      ...bookData,
                      availableCopies: e.target.value,
                    })
                  }
                />
                
              </FormControl>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onClose}>Cancel</Button>
              <Button colorScheme="blue" onClick={handleEditBook} ml={3}>
                Save
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Confirm Deletion</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this book? This action cannot be
              undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onDeleteClose}>Cancel</Button>
              <Button colorScheme="red" onClick={deleteBook} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
