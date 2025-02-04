const ProfilePersonal = () => {
  return (
    <div className="max-w-100  p-4 btn-bg rounded-lg ">
      <h3 className="text-xl font-semibold mb-2">Persönliche Daten</h3>
      {/* Formularfelder zur Bearbeitung von Namen, Email, Profilbild usw. */}
      <form  >
        <div className="mb-4">
          <label>Name:</label>
          <input
            type="text"
            placeholder="Name"
            className="p-4 rounded w-full bg-dark"
          />
        </div>
        <div className="mb-4">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Email"
            className="p-4 rounded w-full bg-dark"
          />
        </div>
        {/* Weitere Felder */}
        <button type="submit" className="bg-accent px-4 py-2 rounded">
          Speichern
        </button>
      </form>
    </div>
  );
};

export default ProfilePersonal;
