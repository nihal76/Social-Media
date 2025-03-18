import axios from "axios";

const API_URL = "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Register user
export const registerUser = async (data) => {
  console.log('api ', data)
  const response = await axiosInstance.post("/auth/register", data);
  return response;
};

// Login user
export const loginUser = async (data) => {
  try {
     const response = await axiosInstance.post("/auth/login", data);
       return response.data;
  } catch (error) {
    return error.response.data.message
  }
};

export const  getUser = async (userId,token) => {
  const response = await axiosInstance.get(`/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log('getuser ', response)
  return response.data
}

// get all users
export const getUsers = async (token) => {
  const response = await axiosInstance.get("/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
    console.log("response ", response.data);
  return response.data;
};

// Create post
export const createPost = async (post, userId, token) => {
  console.log(post);
  const response = await axiosInstance.post(`/posts/createPost/${userId}`, post, {
    headers: {
      Authorization: `Bearer ${token}`
    },
  });
  return response.data;
};

// Get posts
export const getPosts = async (token) => {
  const response = await axiosInstance.get(`/posts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log('all the posts',response.data);
  return response.data;
};
// get specific user posts
export const getPost = async (userId,token) => {
  const response = await axiosInstance.get(`/posts/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
   return response.data;
}

// delete post
export const deletePost = async (postId,token) => {
    console.log('to be deleted ', postId)
  const response = await axiosInstance.delete(`/posts/deletepost/${postId}`,  
    {
       headers: {
      Authorization: `Bearer ${token}`
    }
    }
  )
    return response
}

// post update
export const updatePost = async (postId, updateCaption ,token) => {
  const response = await axiosInstance.patch(`/posts/EditPost/${postId}`, {
    caption : updateCaption
  } ,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Like a post
export const likePost = async (username,postId,token) => {
  const response = await axiosInstance.post(
    `/posts/like?postId=${postId}&username=${username}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data
};

// Comment on a post
export const commentPost = async (username,postId, commentData,token) => {
  const response = await axiosInstance.post(
    `/posts/comment?postId=${postId}&username=${username}`,
    { comment: commentData},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
// delete comment
export const deleteComment = async (postId, commentId,token) => {
  const result = await axiosInstance.delete(`/posts/deleteComment/${postId}/${commentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return result.data.updatedComments;
}

// Follow user
export const followUser = async (profileId,loggedUserId,token) => {
  const response = await axiosInstance.post(
    `/users/follow/${profileId}/${loggedUserId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// Unfollow user
export const unfollowUser = async (userId, token) => {
  const response = await axiosInstance.post(
    `/users/unfollow/${userId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const updateProfile = async (token, updatedProfile) => {
  const response = await axiosInstance.put("/auth/updateProfile", updatedProfile, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data
}

export const updateLinks = async (token, link) => {
  console.log('link ', link)
  const response = await axiosInstance.patch("/users/addLinks", {LinkedIn : link} , {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data
}

// delete account
export const accountDelete = async (token) => {
   console.log("to delete?");
  const response = await axiosInstance.delete("/auth/deleteAccount", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.status
}

// search user profiles
export const searchProfiles = async(users,token) => {
  console.log('to search for ', users)
  const response = await axiosInstance.get(`/users/searchUsers/${users}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return response.data
}