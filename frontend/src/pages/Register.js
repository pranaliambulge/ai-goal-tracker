import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const register = async () => {
    try {
      await axios.post("http://127.0.0.1:5000/auth/register", {
        name, email, password
      });
      alert("Registered successfully!");
      navigate("/login");
    } catch (err) {import { useState } from "react";
    import axios from "axios";
    import { useNavigate, Link } from "react-router-dom";
    
    function Register() {
      const [name, setName] = useState("");
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const navigate = useNavigate();
    
      const register = async () => {
        try {
          await axios.post("http://127.0.0.1:5000/auth/register", {
            name, email, password
          });
          alert("Registered successfully!");
          navigate("/login");
        } catch (err) {
          alert(err.response?.data?.message || "Server error");
        }
      };
    
      return (
        <div className="min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
    
          <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
    
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
              Create Account
            </h2>
    
            <input
              className="w-full border p-2 mb-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Name"
              onChange={e => setName(e.target.value)}
            />
    
            <input
              className="w-full border p-2 mb-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Email"
              onChange={e => setEmail(e.target.value)}
            />
    
            <input
              type="password"
              className="w-full border p-2 mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Password"
              onChange={e => setPassword(e.target.value)}
            />
    
            <button
              onClick={register}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md transition"
            >
              Register
            </button>
    
            <p className="text-center mt-4 text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-purple-600 font-semibold">
                Login
              </Link>
            </p>
    
          </div>
    
        </div>
      );
    }
    
    export default Register;
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert("Server error");
      }
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input placeholder="Name" onChange={e => setName(e.target.value)} />
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
      <button onClick={register}>Register</button>
    </div>
  );
}

export default Register;