const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
const REACT_APP_API_KEY = process.env.REACT_APP_API_KEY;

export interface UploadResponse {
  id: string;
  url: string;
  width: number;
  height: number;
  original_filename: string;
  pending: number;
  approved: number;
}

export interface Cat {
  breeds: any[];
  id: string;
  url: string;
  width: number;
  height: number;
  sub_id: string | null;
  created_at: string;
  original_filename: string;
  breed_ids: string[] | null;
}

interface FavouriteImage {
  id: string;
  url: string;
}

export interface Favourite {
  id: number;
  user_id: string;
  image_id: string;
  sub_id: string | null;
  created_at: string;
  image: FavouriteImage;
}

export interface Vote {
  id: number;
  image_id: string;
  sub_id: string | null;
  value: number;
}

export const getCats = async (
  page: number,
  limit: number = 12,
): Promise<{ cats: Cat[]; meta: any }> => {
  try {
    const response = await fetch(
      `${REACT_APP_API_URL}/images?limit=${limit}&page=${page}&order=DESC`,
      {
        headers: {
          "x-api-key": REACT_APP_API_KEY as string,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Error fetching cats");
    }

    const cats = await response.json();
    const meta = {
      paginationCount: response.headers.get("Pagination-Count"),
      paginationLimit: response.headers.get("Pagination-Limit"),
      paginationPage: response.headers.get("Pagination-Page"),
    };

    return { cats, meta };
  } catch (error) {
    console.error("Error fetching data from The Cat API:", error);
    throw error;
  }
};

export const uploadCat = async (
  formData: FormData,
): Promise<UploadResponse | null> => {
  try {
    const response = await fetch(`${REACT_APP_API_URL}/images/upload`, {
      method: "POST",
      headers: {
        "x-api-key": REACT_APP_API_KEY as string,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data: UploadResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error uploading to The Cat API:", error);
    throw error;
  }
};

export const getFavourites = async (): Promise<Favourite[]> => {
  try {
    const response = await fetch(`${REACT_APP_API_URL}/favourites` as string, {
      headers: {
        "x-api-key": REACT_APP_API_KEY as string,
      },
    });

    if (!response.ok) {
      throw new Error("Error fetching favourites");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching data from The Cat API:", error);
    throw error;
  }
};

export const getVotes = async (): Promise<Vote[]> => {
  try {
    const response = await fetch(`${REACT_APP_API_URL}/votes` as string, {
      headers: {
        "x-api-key": REACT_APP_API_KEY as string,
      },
    });

    if (!response.ok) {
      throw new Error("Error fetching votes");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching data from The Cat API:", error);
    throw error;
  }
};

export const catVote = async ({
  vote,
  id,
}: {
  vote: number;
  id: string;
}): Promise<Vote> => {
  try {
    const response = await fetch(`${REACT_APP_API_URL}/votes`, {
      method: "POST",
      headers: {
        "x-api-key": REACT_APP_API_KEY as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value: vote, image_id: id }),
    });

    if (!response.ok) {
      throw new Error("Failed to save vote");
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading to The Cat API:", error);
    throw error;
  }
};

export const setFavourite = async (id: string): Promise<Vote> => {
  try {
    const response = await fetch(`${REACT_APP_API_URL}/favourites`, {
      method: "POST",
      headers: {
        "x-api-key": REACT_APP_API_KEY as string,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image_id: id }),
    });

    if (!response.ok) {
      throw new Error("Failed to save favourite");
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading to The Cat API:", error);
    throw error;
  }
};

export const removeFavourite = async (id: number): Promise<Vote> => {
  try {
    const response = await fetch(`${REACT_APP_API_URL}/favourites/${id}`, {
      method: "DELETE",
      headers: {
        "x-api-key": REACT_APP_API_KEY as string,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to un-favourite");
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading to The Cat API:", error);
    throw error;
  }
};
