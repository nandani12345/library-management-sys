import React, { useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  useToast,
  Select,
} from "@chakra-ui/react";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [isRegistered, setIsRegistered] = useState(false); // State to control navigation
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:9000/register`,
        formData
      );
      toast({
        title: "Success",
        description: response.data.msg,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setFormData({ name: "", email: "", password: "", role:"" });
      setIsRegistered(true);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.msg || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  if (isRegistered) {
    return <Navigate to="/login" />;
  }

  return (
    <Box w="full" maxW="400px" mx="auto" p={2} boxShadow="lg" borderRadius="md">
      <Heading as="h2" size="lg" mb={2} textAlign="center">
        Register
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={2}>
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Role</FormLabel>
            <Select name="role" value={formData.role} onChange={handleChange}>
              <option value="#">Select option</option>
              <option value="student">Student</option>
              {/* <option value="librarian">Librarian</option> */}
            </Select>
          </FormControl>
          <Button type="submit" colorScheme="teal" width="full">
            Register
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
