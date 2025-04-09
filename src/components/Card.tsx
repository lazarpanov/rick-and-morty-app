import { Badge, Box, Button, Card as ChakraCard, HStack, Image, Text } from "@chakra-ui/react"
import { useTranslation } from "react-i18next";

interface ICardProps {
    image: string
    name: string
    status: string
    species: string
    gender: string
    origin: {
    name : string
    dimension : string
    }
}

const Card = ({image, name, status, species, gender, origin} : ICardProps) => {
    const { t } = useTranslation();
    const statusColor = status === "Alive" ? "green" : status === "Dead" ? "red" : "gray";
    return <ChakraCard.Root flexDirection="row" overflow="hidden" maxW="xxl">
    <Image
      objectFit="cover"
      maxW="200px"
      src={image}
      alt="Caffe Latte"
    />
    <Box>
      <ChakraCard.Body>
        <ChakraCard.Title mb="2">{t("name")}: {name}</ChakraCard.Title>
        <HStack mt="4">
          <Badge color={statusColor}>{t("status")}: {status}</Badge>
          <Badge>{t("species")}: {species}</Badge>
          <Badge>{t("gender")}: {gender}</Badge>
        </HStack>
        <HStack mt="4">
            <Badge>
                <Text whiteSpace="normal">{t("origin")}: {`${origin.name} - ${origin.dimension}`}</Text>
                </Badge>
        </HStack>
      </ChakraCard.Body>
    </Box>
  </ChakraCard.Root>
}
export default Card