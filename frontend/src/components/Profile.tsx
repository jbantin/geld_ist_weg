const Profile = () => {
  // Beispiel-Daten, die durch echte Benutzerdaten ersetzt werden sollten
  const user = {
    email: "user@example.com",
    name: "John Doe",
  };

  return (
    <div className="flex justify-center items-center bg-dark text-light">
      <div className="bg-dark p-6 rounded">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <p className="mb-2">Name: {user.name}</p>
        <p className="mb-2">Email: {user.email}</p>
      </div>
    </div>
  );
};

export default Profile;
