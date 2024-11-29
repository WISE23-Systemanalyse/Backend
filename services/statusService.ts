const statusService = {
  // Gibt den Status der App zurück
  getStatus: async () => {
    return {
      message: "App is running smoothly",
      status: "OK"
    };
  }
};

export { statusService };
