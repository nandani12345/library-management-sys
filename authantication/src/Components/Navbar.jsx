import {
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  Box,
  Flex,
  Text,
  IconButton,
  useDisclosure,
  Collapse,
  Stack,
  Button,
  useToast,
  useColorMode,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useState, useEffect } from "react";

const Navbar = () => {
  const location = useLocation();
  let email = location.state;
  const { isOpen, onToggle } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();

  const [userInfo, setUserInfo] = useState([]);

  const getUserInfo = async () => {
    const token = localStorage.getItem("authT");
    try {
      const response = await axios.post(
        `https://library-management-sys-1o9f.onrender.com/get-user-info-by-id`,
        { email: email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setUserInfo(response.data.data);
      } else {
        toast({
          title: "Error",
          description: response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error in getting user information",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("authT");

    if (!token) {
      toast({
        title: "Error",
        description: "No token found. Please log in first.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios.get(`https://library-management-sys-1o9f.onrender.com/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        localStorage.removeItem("authT");
        localStorage.removeItem("role");
        toast({
          title: "Success",
          description: response.data.msg,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate("/login");
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.msg ||
          "Something went wrong while logging out.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const librarianLinks = [
    {
      text: "Home",
      path: "/",
    },
    {
      text: "Librarian  - Books",
      path: "/librarian",
    },
  ];

  const studentLinks = [
    {
      text: "Home",
      path: "/",
    },
    {
      text: "Books",
      path: "/student",
    },
  ];

  const navigateUser = async () => {
    if(!localStorage.getItem("authT")){
      navigate("/login")
    }
  }

  useEffect(() => {
    getUserInfo();
    navigateUser()
  }, []);

  return (
    <Box
      bg="transparent"
      px={4}
      w="100%"
      zIndex={2}
      bgGradient="linear(to-r, gray.500, yellow.50, pink.500)"
    >
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Text fontSize="xl" color="black">
          Library
        </Text>
        <IconButton
          size="md"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label=" Toggle Navigation"
          display={{ md: "none" }}
          onClick={onToggle}
          colorScheme="teal"
        />
        <Flex alignItems="center" display={{ base: "none", md: "flex" }}>
          {userInfo.role === "librarian" &&
            librarianLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                style={({ isActive }) => ({
                  textDecoration: "none",
                  margin: "0 20px",
                })}
              >
                <Text
                  color={({ isActive }) => (isActive ? "blue.500" : "black")}
                  _hover={{ color: "white" }}
                >
                  {link.text}
                </Text>
              </NavLink>
            ))}
          {userInfo.role === "student" &&
            studentLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                style={({ isActive }) => ({
                  textDecoration: "none",
                  margin: "0 20px",
                })}
              >
                <Text
                  color={({ isActive }) => (isActive ? "blue.500" : "black")}
                  _hover={{ color: "white" }}
                >
                  {link.text}
                </Text>
              </NavLink>
            ))}
          <Button
            colorScheme="red"
            onClick={handleLogout}
            size="sm"
            width={{ base: "100%", md: "auto" }}
            ml={4}
          >
            Logout
          </Button>
          <Button onClick={toggleColorMode} mx="10px">
            {colorMode === "light" ? "Dark" : "Light"}
          </Button>
        </Flex>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <Stack bg="teal.500" p={4} display={{ md: "none" }} textAlign={"right"}>
          {userInfo.role === "librarian" &&
            librarianLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                style={({ isActive }) => ({
                  textDecoration: "none",
                  margin: "10px 0",
                })}
              >
                <Text
                  color={({ isActive }) => (isActive ? "blue.500" : "white")}
                  _hover={{ color: "white" }}
                >
                  {link.text}
                </Text>
              </NavLink>
            ))}
          {userInfo.role === "student" &&
            studentLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                style={({ isActive }) => ({
                  textDecoration: "none",
                  margin: "10px 0",
                })}
              >
                <Text
                  color={({ isActive }) => (isActive ? "blue.500" : "white")}
                  _hover={{ color: "white" }}
                >
                  {link.text}
                </Text>
              </NavLink>
            ))}
          <Button
            colorScheme="purple"
            onClick={handleLogout}
            size="sm"
            width="100%"
            mt={2}
          >
            Logout
          </Button>
        </Stack>
      </Collapse>
    </Box>
  );
};

export default Navbar;
