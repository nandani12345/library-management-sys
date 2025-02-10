import React, { useState } from "react";
import axios from "axios";
import Login from "../Auths/login";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";

export default function ForgetPassword() {
  const [formData, setFormData] = useState({ email: "" });
  const toast = useToast();
  const navigate = useNavigate();
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:9000/forget",
        formData
      );
      console.log(response);
      
      toast({
        title: "Success",
        description: response.data.msg,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.msg || "Invalid email",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      w="full"
      maxW="400px"
      mx="auto"
      mt={5}
      p={5}
      boxShadow="2px 2px 2px 2px black"
      borderRadius="md"
      backgroundColor="whiteAlpha.500"
      h="auto"
      color="black"
    >
      <Heading as="h2" size="lg" mb={5} textAlign="center">
        Forget Password
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
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
          <Button type="submit" colorScheme="teal" width="full">
            Send Reset Link
          </Button>
        </VStack>
      </form>
      <Link to="/login">Back to Login</Link>
    </Box>
  );
}