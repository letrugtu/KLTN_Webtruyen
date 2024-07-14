import axios from "axios";
import {
  AuthLogin,
  AuthRegister,
  ChangePassword,
  GetCategories,
  GetChapterDetail,
  GetStories,
  GetUserInfo,
  ResetPassword,
  UnlockChapter,
} from "./apis";
import { toast } from "react-toastify";

export const register = async (data) => {
  try {
    const res = await axios.post(AuthRegister, data);
    toast.info("Đăng kí thành công, hãy kiểm tra email của bạn");
    return res.data;
  } catch (error) {
    toast.error("Đăng kí thất bại");
    return {
      error,
      type: "error",
    };
  }
};

export const login = async (data) => {
  try {
    const res = await axios.post(AuthLogin, data);
    return res.data;
  } catch (error) {
    toast.error("Đăng nhập thất bại");
    return {
      error,
      type: "error",
    };
  }
};

export const getCategory = async () => {
  const res = await axios.get(GetCategories);
  return res.data;
};

export const getStories = async (data) => {
  const res = await axios.post(GetStories, data);
  return res.data;
};

export const getChapterDetail = async (params = "", token = undefined) => {
  try {
    if (token) {
      const res = await axios.get(GetChapterDetail + params, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } else {
      const res = await axios.get(GetChapterDetail + params);
      return res.data;
    }
  } catch (error) {
    toast.error("Bạn chưa trả xu để coi chương này");
    return {
      error: error.message,
      type: "error",
    };
  }
};

export const unlockChapter = async (data, token) => {
  try {
    await axios.post(UnlockChapter, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    toast.success("Thanh toán thành công");
  } catch (error) {
    toast.error("Không đủ xu để mua chương, hãy nạp thêm");
  }
};
export const callApiFEGet = async (URL, params = "") => {
  const res = await axios.get(URL + params);
  return res.data;
};

export const callApiFEPost = async (URL, data = {}) => {
  try {
    const res = await axios.post(URL, data, {
      headers: {
        "Content-Type": "application/json-patch+json",
      },
    });
    return res.data;
  } catch (error) {
    toast.error(error.message);
    return {
      error,
      type: "error",
    };
  }
};

export const callAPIFEPostToken = async (token, url, data) => {
  try {
    const res = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    toast.error(error.message);
    return {
      error,
      type: "error",
    };
  }
};

export const callAPIFEDelToken = async (token, url, params = "") => {
  try {
    const res = await axios.delete(url + params, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    toast.error(error.message);
    return {
      error,
      type: "error",
    };
  }
};

export const callAPIFEGetToken = async (token, url, params = "") => {
  try {
    const res = await axios.get(url + params, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    toast.error(error.message);
    return {
      error,
      type: "error",
    };
  }
};

export const getUserInfo = async (token) => {
  // try {
  //   const res = await axios.post(GetUserInfo, {
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${token}`
  //     }
  //   });
  //   return res.data;
  // } catch (error) {
  //   toast.error("Đăng nhập hết thời hạn");
  //   return {
  //     error,
  //     type: "error",
  //   };
  // }

  let res = {};
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  await fetch(GetUserInfo, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      res = response.json();
    })
    .catch((error) => {
      toast.error("Đăng nhập hết thời hạn");
      res = { ...error, type: "error" };
    });

  return res;
};

export const changePassword = async (token, data) => {
  const res = await axios.post(ChangePassword, data, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const resetPassword = async (email) => {
  try {
    const res = await axios.post(ResetPassword, email, {
      headers: {
        "Content-Type": "application/json-patch+json",
      },
    });
    toast.info("Hãy kiểm tra email của bạn");
    return res.data;
  } catch (error) {
    toast.error("Email này chưa đăng ký tài khoản");
  }
};
