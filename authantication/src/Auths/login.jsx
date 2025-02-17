import React, { useState } from "react";
import Registration from "../Auths/Registration";
import ForgetPassword from "../Auths/forget";
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
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Avatar,
} from "@chakra-ui/react";
import { AiOutlineUser   } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://library-management-sys-1o9f.onrender.com/login",
        formData
      );
      const { token } = response.data;
      localStorage.setItem("authT", token);
      localStorage.setItem("role", response.data.role);                                                                                 
      // console.log("Token stored:", token);

      setFormData({ email: "", password: "" });
      navigate("/", {state: formData.email});

      // console.log(response);

      toast({
        title: "Success",
        description: response.data.msg,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.msg || "Invalid credentials",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleForgetPassword = () => {
    navigate("/forget");
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
      bgGradient="linear(to-r, gray.300, yellow.400, pink.200)"
    >
      <Heading as="h2" size="lg" mb={5} textAlign="center">
        Login <Avatar bg="red.500" icon={<AiOutlineUser   fontSize="1.5rem" />} />
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
          <Button type="submit" colorScheme="teal" width="full">
            Login
          </Button>
        </VStack>
      </form>
      <Link onClick={onOpen}>Register</Link>
      <span style={{ marginLeft: "10px", cursor: "pointer" }} onClick={handleForgetPassword}>forget-Password</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Registration />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};