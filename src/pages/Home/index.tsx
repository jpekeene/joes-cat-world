import React, { useState, useEffect, useCallback } from "react";
import { Button, Grid, CircularProgress } from "@mui/material";
import { useSnackbar } from "../../shared/SnackbarProvider";
import {
  getCats,
  getFavourites,
  getVotes,
  removeFavourite,
  setFavourite,
  catVote,
  Favourite,
} from "../../shared/catService";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import NorthIcon from "@mui/icons-material/North";
import SouthIcon from "@mui/icons-material/South";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export const Home: React.FC = () => {
  const [cats, setCats] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({});
  const [favourites, setFavourites] = useState<any[]>([]);
  const [votes, setVotes] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const openSnackbar = useSnackbar();

  const getFavouriteCats = useCallback(async () => {
    const favs = await getFavourites();
    setFavourites(favs);
  }, []);

  const getVotedCats = useCallback(async () => {
    const votes = await getVotes();
    setVotes(votes);
  }, []);

  useEffect(() => {
    const fetchCats = async () => {
      setLoading(true);
      try {
        const { cats, meta } = await getCats(page, 12);
        setCats(cats);
        setMeta(meta);
        setLoading(false);
      } catch (error) {
        openSnackbar("Error fetching cats", "error");
        setLoading(false);
      }
    };

    fetchCats();
  }, [page, openSnackbar]);

  useEffect(() => {
    getFavouriteCats();
  }, [getFavouriteCats]);

  useEffect(() => {
    getVotedCats();
  }, [getVotedCats]);

  const isFavourite = (id: string): Favourite => {
    return favourites.find((fav) => fav.image_id === id);
  };

  const handleFavourite = async (id: string) => {
    const existingFavourite = isFavourite(id);
    if (existingFavourite) {
      try {
        await removeFavourite(existingFavourite.id);
        await getFavouriteCats();
      } catch (error) {
        openSnackbar("Error saving favourite", "error");
      }
    }

    if (!existingFavourite) {
      try {
        await setFavourite(id);
        await getFavouriteCats();
      } catch (error) {
        openSnackbar("Error saving favourite", "error");
      }
    }
  };

  const countVotes = (id: string) => {
    return votes
      .filter((vote) => vote.image_id === id)
      .reduce((acc, vote) => {
        return vote.value === 1 ? acc + 1 : vote.value === 0 ? acc - 1 : acc;
      }, 0);
  };

  const handleVote = async ({ vote, id }: { vote: number; id: string }) => {
    try {
      await catVote({ vote, id });
      await getVotedCats();
    } catch (error) {
      openSnackbar("Error voting", "error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">My Cats</h1>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {cats?.map((cat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <div className="relative">
                <img
                  src={cat.url}
                  alt={`cat_${cat.id}`}
                  className="w-full h-64 object-cover"
                />
                <div className="flex items-center">
                  <div className="flex justify-between items-center">
                    <IconButton
                      data-testid={`up_${cat.id}`}
                      className="bg-white"
                      onClick={() => handleVote({ vote: 1, id: cat.id })}
                    >
                      <NorthIcon />
                    </IconButton>
                    <div className="">{countVotes(cat.id)}</div>
                    <IconButton
                      data-testid={`down_${cat.id}`}
                      className="bg-white"
                      onClick={() => handleVote({ vote: 0, id: cat.id })}
                    >
                      <SouthIcon />
                    </IconButton>
                  </div>
                  <div className="flex items-center ml-auto">
                    <IconButton
                      data-testid={`fav_${cat.id}`}
                      className="bg-white"
                      onClick={() => handleFavourite(cat.id)}
                    >
                      {isFavourite(cat.id) ? (
                        <FavoriteIcon color="error" />
                      ) : (
                        <FavoriteBorderIcon />
                      )}
                    </IconButton>
                  </div>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
      )}
      <div className="mt-4 flex items-center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setPage(page - 1)}
          disabled={page === 0}
          startIcon={<ChevronLeftIcon />}
        >
          Previous
        </Button>
        <span className="m-4"></span>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setPage(page + 1)}
          className="ml-4"
          disabled={
            parseInt(meta.paginationCount || "0", 10) <=
            parseInt(meta.paginationLimit || "0", 10)
          }
          endIcon={<ChevronRightIcon />}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
