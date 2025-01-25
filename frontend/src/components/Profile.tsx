const Profile = () => {
  // Beispiel-Daten, die durch echte Benutzerdaten ersetzt werden sollten
  const user = {
    email: "user@example.com",
    name: "John Doe",
  };

  return (
    <div className="flex justify-center items-center bg-zinc-900 text-white">
      <div className="bg-zinc-800 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        <p className="mb-2">Name: {user.name}</p>
        <p className="mb-2">Email: {user.email}</p>
      </div>
    </div>
  );
};

export default Profile;
