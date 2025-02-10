import React, { useState } from "react";
import axios from "axios";
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
import { Link, useNavigate, useParams } from "react-router-dom";

export default function ResetPassword() {
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const toast = useToast();
  const navigate = useNavigate();
  const { token } = useParams();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      const response = await axios.post(
        `https://library-management-sys-1o9f.onrender.com/reset-password/${token}`,
        formData
      );
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
        description: error.response?.data?.msg || "Invalid token",
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
        Reset Password
      </Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your new password"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              name="confirmPassword value={formData.confirmPassword}"
              onChange={handleChange}
              placeholder="Confirm your new password"/>
          </FormControl>
          <Button type="submit" colorScheme="teal" width="full">
            Reset Password
          </Button>
        </VStack>
      </form>
      <Link to="/login">Back to Login</Link>
    </Box>
  );
}