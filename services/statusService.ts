const statusService = {
  // Gibt den Status der App zurück
  // deno-lint-ignore require-await
  getStatus: async () => {
    return {
      message: "App is running smoothly :)",
      status: "OK"
    };
  }
};

export { statusService };
