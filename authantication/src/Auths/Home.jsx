import {
  Box,
  Button,
  Container,
  Heading,
  Image,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Card,
  Stack,
  CardBody,
  CardFooter,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();
  const cardData = [
    {
      title: "User  Dashboard",
      image:
        "https://images.pexels.com/photos/904616/pexels-photo-904616.jpeg?auto=compress&cs=tinysrgb&w=600",
      text: "Access your student profile and manage your account.",
      button: "View Profile",
      action: () => navigate("/user"),
    },
    {
      title: "Only Librarian use",
      image:
        "https://images.pexels.com/photos/1290141/pexels-photo-1290141.jpeg?auto=compress&cs=tinysrgb&w=600",
      text: "Librarian-only feature to add new books to the library.",
      button: "Librarian",
      action: () => navigate("/librarian"),
    },
    {
      title: "Borrow Book",
      image:
        "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=600",
      text: "Students can borrow books from the library collection.",
      button: "Borrow Book",
      action: () => navigate("/borrowbook"),
    },
  ];

  const bgGradient = useColorModeValue(
    "linear(to-r, teal.500, blue.500)",
    "linear(to-r, teal.600, blue.600)"
  );

  const cardBg = useColorModeValue("white", "gray.700");
  const cardHoverBg = useColorModeValue("gray.50", "gray.600");

  return (
    <Box>
      <Container maxW="container.xl" my={10}>
        {/* Hero Section */}
        <VStack spacing={6} textAlign="center" mb={10}>
          <Heading
            bgGradient={bgGradient}
            bgClip="text"
            fontSize={{ base: "4xl", md: "6xl" }}
            fontWeight="extrabold"
          >
            Library Management System
          </Heading>
          <Text fontSize={{ base: "lg", md: "xl" }} color="gray.500">
            Your gateway to a world of knowledge. Explore, borrow, and manage
            books with ease.
          </Text>
        </VStack>

        {/* Feature Cards */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          {cardData.map((card, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card
                bg={cardBg}
                borderRadius="xl"
                boxShadow="lg"
                _hover={{ bg: cardHoverBg, transform: "translateY(-5px)" }}
                transition="all 0.3s ease"
              >
                <Image
                  src={card.image}
                  alt={card.title}
                  borderTopRadius="xl"
                  height="200px"
                  objectFit="cover"
                />
                <CardBody>
                  <Heading size="md" mb={2}>
                    {card.title}
                  </Heading>
                  <Text color="gray.500">{card.text}</Text>
                </CardBody>
                <CardFooter>
                  <Button colorScheme="blue" width="full" onClick={card.action}>
                    {card.button}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </SimpleGrid>

        {/* Call to Action Section */}
        <Card
          direction={{ base: "column", md: "row" }}
          overflow="hidden"
          variant="outline"
          mt={10}
          bg={cardBg}
          borderRadius="xl"
          boxShadow="lg"
        >
          <Image
            objectFit="cover"
            maxW={{ base: "100%", md: "300px" }}
            src="https://s.tmimgcdn.com/scr/1200x750/167700/beautiful-female-programmer-working-on-the-computer-in-video-footage_167768-original.jpg"
            alt="Librarian at work"
          />
          <Stack>
            <CardBody textAlign="left">
              <Heading fontSize="20px" size="md">
                Discover the Perfect Books
              </Heading>
              <Text py="2" textAlign="center">
                Enjoy 50% off on your first order. Register now!
              </Text>
              <Text>Join our community and start your reading journey.</Text>
            </CardBody>
            <CardFooter>
              <Button
                variant="solid"
                colorScheme="blue"
                onClick={() => navigate("/login")}
                width="full"
              >
                Register
              </Button>
            </CardFooter>
          </Stack>
        </Card>

        {/* Footer Section */}
        <Box bg="gray.800" color="white" py={6} mt={10}>
          <Container>
            <VStack spacing={4} align="center">
              <Heading size="lg">Library Management System</Heading>
              <HStack spacing={4}>
                <Link href="/about" color="teal.300">
                  About Us
                </Link>
                <Link href="/contact" color="teal.300">
                  Contact
                </Link>
                <Link href="/terms" color="teal.300">
                  Terms & Conditions
                </Link>
              </HStack>
              <Text fontSize="sm" className="text-muted">
                © {new Date().getFullYear()} Library Management System. All
                Rights Reserved.
              </Text>
            </VStack>
          </Container>
        </Box>
      </Container>
    </Box>
  );
}
