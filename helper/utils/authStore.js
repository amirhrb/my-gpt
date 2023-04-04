import { create } from "zustand";

const useAuthStore = create((set, get) => ({
  loading: false,
  validating: true,
  isValid: false,
  toast: { status: "", message: "" },
  refresh: async () => {
    set({ loading: true });
    const response = await fetch("/api/refresh", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      set({
        loading: false,
        validating: false,
        isValid: true,
      });
    } else {
      set({
        loading: false,
        validating: false,
        isValid: false,
      });
    }
  },
  login: async (OPENAI_API_KEY) => {
    set({ loading: true });
    if (OPENAI_API_KEY) {
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          body: JSON.stringify({ userKey: OPENAI_API_KEY }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.status === 201) {
          const data = await response.json();
          set({
            toast: { status: "success", message: data.message },
            loading: false,
            validating: false,
            isValid: true,
          });
          return;
        }
        if (response.status === 200) {
          set({
            loading: false,
            validating: false,
            isValid: true,
          });
          return;
        }
        if (response.status !== 200) {
          set({
            loading: false,
            toast: { status: "failure", message: "Entered key is invalid!" },
            isValid: false,
          });
          return;
        }
      } catch (error) {
        set({
          loading: false,
          toast: { status: "error", message: error },
          isValid: false,
        });
        console.log(error);
        return;
      }
    }
    set({
      loading: false,
      toast: { status: "failure", message: "Enter a valid api key" },
      isValid: false,
    });
    return;
  },
}));

export default useAuthStore;
