import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from "react-i18next";
import { useQuery, gql } from '@apollo/client';
import Card from './components/Card';
import {
  Text,
  Flex,
  SimpleGrid,
  Box,
  Spinner,
} from '@chakra-ui/react';
import LocaleSwitcher from './i18n/LocaleSwitcher';

const GET_CHARACTERS = gql`
  query GetCharacters($page: Int, $filter: FilterCharacter) {
    characters(page: $page, filter: $filter) {
      results {
        id
        name
        status
        species
        gender
        origin {
          name
          dimension
        }
        image
      }
      info {
        next
      }
    }
  }
`;

const filterOptions = {
  status: ["Alive", "Dead", "unknown"],
  species: ["Human", "Alien", "Robot"],
  sort: ["name", "origin"],
};


export default function App() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({ status: '', species: '', sort: '' });
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const variables = useMemo(() => ({
    page: 1,
    filter: {
      status: filters.status || undefined,
      species: filters.species || undefined,
    },
  }), [filters.status, filters.species]);

  const { loading, error, data, fetchMore, refetch } = useQuery(GET_CHARACTERS, {
    variables,
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => { refetch(variables); }, [variables, refetch]);

  const lastCharacterRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    observer.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && data?.characters.info.next) {
        setIsFetchingMore(true);
        fetchMore({
          variables: { ...variables, page: data.characters.info.next },
          updateQuery: (prev, { fetchMoreResult }) => {
            setIsFetchingMore(false);
            if (!fetchMoreResult) {
              return prev;
            }
            return {
              characters: {
                ...prev.characters,
                info: fetchMoreResult.characters.info,
                results: [...prev.characters.results, ...fetchMoreResult.characters.results],
              },
            };
          },
        });
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, data, fetchMore, variables]);

  const sortedResults = useMemo(() => {
    if (!data?.characters.results) {
      return [];
    }
    const sorted = [...data.characters.results];
    if (filters.sort === 'origin') {
      return sorted.sort((a, b) => a.origin.name.localeCompare(b.origin.name));
    }
    if (filters.sort === 'name') return sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [data, filters.sort]);

  if (loading && !data?.characters) {
    return (
      <Box pos="fixed" inset="0" bg="rgba(0, 0, 0, 0.6)" zIndex={999}>
        <Flex justify="center" align="center" minH="100vh">
          <Spinner size="xl" color="teal.400" />
        </Flex>
      </Box>
    );
  }

  if (error) {
    return (
      <Flex justify="center" align="center">
        <Text fontSize="xl" color="red.400" textAlign="center" maxW="320px">
          Something went wrong with fetching the data
        </Text>
      </Flex>
    );
  }

  return (
    <Flex direction="column" my={{ md: 6 }}>
      <Flex gap={4} px={4} mb={6} flexWrap="wrap" justify="center">
      <h2>{t("hello_world")}</h2>
        {Object.entries(filterOptions).map(([key, options]) => (
          <Box as="label" key={key}>
            <select
              value={filters[key as keyof typeof filters]}
              onChange={(e) => setFilters((prev) => ({ ...prev, [key]: e.target.value }))}
              style={{ maxWidth: '200px' }}
            >
              <option value="">{`Select ${key}`}</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </Box>
        ))}
      <LocaleSwitcher></LocaleSwitcher>
      </Flex>
      <Flex justify="center" align="center" direction="column">
        <SimpleGrid columns={[2, null, 3]} gap="20px">
          {sortedResults.map((character, index) => (
            <Box
              key={character.id}
              ref={index === sortedResults.length - 1 ? lastCharacterRef : undefined}
              mx={{ md: 3 }}
            >
              <Card {...character} />
            </Box>
          ))}
        </SimpleGrid>

        {isFetchingMore && (
          <Box pos="fixed" inset="0" bg="rgba(0, 0, 0, 0.4)" zIndex={999}>
            <Flex justify="center" align="center" h="100vh">
              <Spinner size="xl" color="teal.400" />
            </Flex>
          </Box>
        )}
      </Flex>
    </Flex>
  );
}