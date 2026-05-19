import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";

import API from "./api";
import { auth } from "./auth";
import logo from "./assets/logo.png";


// =====================================
// Rolling latency animation
// =====================================

function RollingNumber({ value }) {

  return (

    <div className="
      overflow-hidden
      h-[1em]
      flex
      flex-col
      items-center
    ">

      <AnimatePresence mode="wait">

        <motion.span
          key={value}
          initial={{
            y: 20,
            opacity: 0
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          exit={{
            y: -20,
            opacity: 0
          }}
          transition={{
            duration: 0.4,
            ease: "circOut"
          }}
        >

          {value ?? "—"}

        </motion.span>

      </AnimatePresence>

    </div>
  );
}


function App() {

  // =====================================
  // AUTH STATES
  // =====================================

  const [user, setUser] = useState(null);

  const [authMode, setAuthMode] =
    useState("login");

  const [authLoading, setAuthLoading] =
    useState(false);

  const [authError, setAuthError] =
    useState("");

  const [authForm, setAuthForm] =
    useState({
      name: "",
      email: "",
      password: ""
    });


  // =====================================
  // SERVER STATES
  // =====================================

  const [servers, setServers] =
    useState([]);

  const [formData, setFormData] =
    useState({
      name: "",
      ip: "",
      port: ""
    });


  // =====================================
  // LOAD SESSION
  // =====================================

  useEffect(() => {

    async function loadUser() {

      try {

        const session =
          await auth.getSession();

        if (session?.data?.user) {

          setUser(session.data.user);
        }

      } catch (error) {

        console.error(error);
      }
    }

    loadUser();

  }, []);


  // =====================================
  // FETCH SERVERS
  // =====================================

  async function fetchServers() {

    if (!user) return;

    try {

      const response = await API.get(
        `/servers/?user_id=${user.id}`
      );

      setServers(response.data);

    } catch (error) {

      console.error(
        "Error fetching servers:",
        error
      );
    }
  }


  // =====================================
  // LIVE MONITORING
  // =====================================

  useEffect(() => {

    if (!user) return;

    async function monitorServers() {

      try {

        const response = await API.get(
          `/servers/?user_id=${user.id}`
        );

        const currentServers =
          response.data;

        await Promise.all(

          currentServers.map((server) =>

            API.post(
              `/servers/check/${server.id}`
            )
          )
        );

        fetchServers();

      } catch (error) {

        console.error(error);
      }
    }

    monitorServers();

    const interval = setInterval(() => {

      monitorServers();

    }, 5000);

    return () => clearInterval(interval);

  }, [user]);


  // =====================================
  // ADD SERVER
  // =====================================

  async function addServer(e) {

    e.preventDefault();

    if (!formData.name.trim()) {

      alert("Server name is required");

      return;
    }

    if (!formData.ip.trim()) {

      alert("IP / Domain is required");

      return;
    }

    if (!formData.port) {

      alert("Port number is required");

      return;
    }

    if (
      Number(formData.port) < 1 ||
      Number(formData.port) > 65535
    ) {

      alert(
        "Port must be between 1 and 65535"
      );

      return;
    }

    try {

      const response = await API.post(
        "/servers/",
        {

          ...formData,

          port: Number(formData.port),

          user_id: user.id
        }
      );

      const newServer = response.data;

      await API.post(
        `/servers/check/${newServer.id}`
      );

      setFormData({
        name: "",
        ip: "",
        port: ""
      });

      fetchServers();

    } catch (error) {

      console.error(error);
    }
  }


  // =====================================
  // DELETE SERVER
  // =====================================

  async function deleteServer(serverId) {

    try {

      await API.delete(
        `/servers/${serverId}`
      );

      fetchServers();

    } catch (error) {

      console.error(error);
    }
  }


  // =====================================
  // SIGNUP
  // =====================================

  async function handleSignUp() {

    try {

      setAuthLoading(true);

      setAuthError("");

      const result =
        await auth.signUp.email({

          name: authForm.name,

          email: authForm.email,

          password: authForm.password

        });

      console.log(result);

      setAuthForm({
        name: "",
        email: "",
        password: ""
      });

      alert(
        "Signup successful. Please verify your email."
      );

    } catch (error) {

      console.error(error);

      setAuthError(
        error.message || "Signup failed"
      );

    } finally {

      setAuthLoading(false);

    }
  }


  // =====================================
  // LOGIN
  // =====================================

  async function handleLogin() {

    try {

      setAuthLoading(true);

      setAuthError("");

      const result =
        await auth.signIn.email({

          email: authForm.email,

          password: authForm.password

        });

      console.log(result);

      const session =
        await auth.getSession();

      if (session?.data?.user) {

        setUser(session.data.user);
      }

    } catch (error) {

      console.error(error);

      setAuthError(
        error.message || "Login failed"
      );

    } finally {

      setAuthLoading(false);
    }
  }


  // =====================================
  // LOGOUT
  // =====================================

  async function handleLogout() {

    await auth.signOut();

    setUser(null);
  }


  // =====================================
  // AUTH SCREEN
  // =====================================

  if (!user) {

    return (

      <div className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-slate-950
        text-white
        p-6
      ">

        <div className="
          w-full
          max-w-lg
          bg-white/5
          border
          border-white/10
          backdrop-blur-xl
          rounded-3xl
          p-8
          shadow-2xl
        ">

          <div className="
            flex
            flex-col
            items-center
            justify-center
            mb-10
          ">

            <img
              src={logo}
              alt="NetSight Logo"
              className="
                w-28
                h-28
                object-contain
                scale-125
                mb-5
                drop-shadow-[0_0_20px_rgba(16,185,129,0.22)]
              "
            />

            <p className="
              text-xs
              uppercase
              tracking-[0.3em]
              text-emerald-400
              mb-4
            ">
              Infrastructure Observability Platform
            </p>

            <h1 className="
              text-5xl
              md:text-6xl
              font-black
              mb-4
            ">
              NetSight
            </h1>

            <p className="
              text-slate-300
              text-lg
              leading-relaxed
              text-center
            ">
              Monitor your infrastructure in real-time.
              Track latency, uptime, and service health
              through a beautiful observability dashboard.
            </p>

          </div>


          {
            authMode === "signup" && (

              <input
                type="text"
                placeholder="Name"
                value={authForm.name}
                onChange={(e) =>
                  setAuthForm({
                    ...authForm,
                    name: e.target.value
                  })
                }
                className="
                  w-full
                  p-4
                  mb-4
                  rounded-2xl
                  bg-slate-900
                  border
                  border-slate-700
                  outline-none
                "
              />
            )
          }


          <input
            type="email"
            placeholder="Email"
            value={authForm.email}
            onChange={(e) =>
              setAuthForm({
                ...authForm,
                email: e.target.value
              })
            }
            className="
              w-full
              p-4
              mb-4
              rounded-2xl
              bg-slate-900
              border
              border-slate-700
              outline-none
            "
          />


          <input
            type="password"
            placeholder="Password"
            value={authForm.password}
            onChange={(e) =>
              setAuthForm({
                ...authForm,
                password: e.target.value
              })
            }
            className="
              w-full
              p-4
              mb-4
              rounded-2xl
              bg-slate-900
              border
              border-slate-700
              outline-none
            "
          />


          {authError && (

            <p className="
              text-red-400
              mb-4
              text-sm
            ">
              {authError}
            </p>
          )}


          <button
            onClick={
              authMode === "login"
                ? handleLogin
                : handleSignUp
            }
            disabled={authLoading}
            className="
              w-full
              bg-white
              text-black
              py-4
              rounded-2xl
              font-semibold
              mb-4
              hover:scale-[1.01]
              transition-all
            "
          >

            {authLoading
              ? "Please wait..."
              : authMode === "login"
                ? "Login"
                : "Create Account"
            }

          </button>


          <button
            onClick={() =>
              setAuthMode(
                authMode === "login"
                  ? "signup"
                  : "login"
              )
            }
            className="
              w-full
              text-slate-400
              hover:text-white
              transition-all
            "
          >

            {authMode === "login"
              ? "Create an account"
              : "Already have an account?"
            }

          </button>

        </div>

      </div>
    );
  }


  // =====================================
  // DASHBOARD
  // =====================================

  return (

    <div className="
      min-h-screen
      px-4
      py-8
      md:px-16
      md:py-12
      max-w-7xl
      mx-auto
      text-white
    ">

      {/* TOP NAVBAR */}

      <div className="
        flex
        items-center
        justify-between
        mb-12
      ">

        <div className="
          flex
          items-center
          gap-4
        ">

          {/* LOGO */}

          <div className="
            w-16
            h-16
            flex
            items-center
            justify-center
            shrink-0
          ">

            <img
              src={logo}
              alt="NetSight Logo"
              className="
                w-full
                h-full
                object-contain
                scale-135
                drop-shadow-[0_0_18px_rgba(16,185,129,0.22)]
              "
            />

          </div>


          {/* TITLE */}

          <div className="
            flex
            flex-col
            justify-center
          ">

            <p className="
              text-[10px]
              md:text-xs
              uppercase
              tracking-[0.25em]
              text-slate-400
              leading-none
              mb-2
            ">
              Real-Time Infrastructure Monitoring
            </p>

            <h1 className="
              text-3xl
              md:text-5xl
              font-extrabold
              tracking-tight
              leading-none
            ">
              NetSight
            </h1>

          </div>

        </div>


        {/* USER PANEL */}

        <div className="
          flex
          items-center
          gap-4
          bg-white/5
          border
          border-white/10
          rounded-2xl
          px-4
          py-3
          backdrop-blur-xl
        ">

          <div className="
            w-10
            h-10
            rounded-full
            bg-emerald-500
            flex
            items-center
            justify-center
            font-bold
            text-black
          ">

            {user?.name?.[0]?.toUpperCase()
              || "U"}

          </div>


          <div className="hidden md:block">

            <p className="
              text-sm
              text-slate-400
            ">
              Logged in as
            </p>

            <p className="font-semibold">

              {user?.name || user?.email}

            </p>

          </div>


          <button
            onClick={handleLogout}
            className="
              bg-red-500/10
              border
              border-red-500/20
              px-4
              py-2
              rounded-xl
              text-red-300
              hover:bg-red-500/20
              transition-all
            "
          >
            Logout
          </button>

        </div>

      </div>


      {/* ADD SERVER FORM */}

      <form
        onSubmit={addServer}
        className="
          bg-white/5
          border
          border-white/10
          backdrop-blur-xl
          rounded-3xl
          p-6
          mb-12
          grid
          grid-cols-1
          md:grid-cols-4
          gap-4
        "
      >

        <input
          type="text"
          placeholder="Service Name"
          value={formData.name}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value
            })
          }
          className="
            p-4
            rounded-2xl
            bg-slate-900
            border
            border-slate-700
            outline-none
          "
        />

        <input
          type="text"
          placeholder="IP / Domain"
          value={formData.ip}
          onChange={(e) =>
            setFormData({
              ...formData,
              ip: e.target.value
            })
          }
          className="
            p-4
            rounded-2xl
            bg-slate-900
            border
            border-slate-700
            outline-none
          "
        />

        <input
          type="number"
          placeholder="Port"
          value={formData.port}
          onChange={(e) =>
            setFormData({
              ...formData,
              port: e.target.value
            })
          }
          className="
            p-4
            rounded-2xl
            bg-slate-900
            border
            border-slate-700
            outline-none
          "
        />

        <button
          type="submit"
          className="
            bg-emerald-500
            text-black
            font-bold
            rounded-2xl
            hover:scale-[1.02]
            transition-all
          "
        >
          Add Server
        </button>

      </form>


      {/* SERVER GRID */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-6
      ">

        {servers.map((server) => {

          const isUp =
            server.status?.toLowerCase() === "up";

          return (

            <motion.div
              key={server.id}

              whileHover={{
                y: -8,
                scale: 1.02
              }}

              transition={{
                type: "spring",
                stiffness: 250,
                damping: 18
              }}

              className={`
                relative
                overflow-hidden
                backdrop-blur-xl
                rounded-3xl
                p-8
                border
                transition-all
                duration-500

                ${isUp
                  ? `
                    bg-emerald-500/10
                    border-emerald-400/20
                    shadow-[0_0_35px_rgba(16,185,129,0.12)]
                  `
                  : `
                    bg-red-500/10
                    border-red-400/20
                    shadow-[0_0_25px_rgba(248,113,113,0.08)]
                  `
                }
              `}
            >

              {/* TOP ROW */}

              <div className="
                flex
                items-start
                justify-between
                mb-8
              ">

                {/* DELETE BUTTON */}

                <button
                  onClick={() =>
                    deleteServer(server.id)
                  }
                  className="
                    flex
                    items-center
                    justify-center
                    w-10
                    h-10
                    rounded-xl
                    bg-red-500/10
                    border
                    border-red-500/20
                    text-red-300
                    hover:bg-red-500/20
                    hover:scale-105
                    transition-all
                  "
                >

                  <Trash2 size={18} />

                </button>


                {/* PULSATING STATUS DOT */}

                <span className="
                  relative
                  flex
                  h-4
                  w-4
                ">

                  <span className={`
                    absolute
                    inline-flex
                    h-full
                    w-full
                    rounded-full
                    opacity-75
                    animate-ping

                    ${isUp
                      ? "bg-emerald-400"
                      : "bg-red-400"}
                  `} />

                  <span className={`
                    relative
                    inline-flex
                    rounded-full
                    h-4
                    w-4

                    ${isUp
                      ? "bg-emerald-400"
                      : "bg-red-400"}
                  `} />

                </span>

              </div>


              {/* STATUS */}

              <p className="
                text-sm
                uppercase
                tracking-widest
                text-slate-400
                mb-6
              ">
                {server.status}
              </p>


              {/* SERVER NAME */}

              <h2 className="
                text-3xl
                font-bold
                mb-3
              ">
                {server.name}
              </h2>


              {/* IP */}

              <p className="
                text-slate-400
                mb-8
                break-all
              ">
                {server.ip}:{server.port}
              </p>


              {/* FOOTER */}

              <div className="
                flex
                items-end
                justify-between
              ">

                {/* LATENCY */}

                <div>

                  <p className="
                    text-slate-400
                    text-sm
                    mb-1
                  ">
                    Latency
                  </p>

                  <h3 className="
                    text-4xl
                    font-bold
                  ">

                    <RollingNumber
                      value={server.latency}
                    />

                  </h3>

                </div>


                {/* HEALTH */}

                <div className="text-right">

                  <p className="
                    text-slate-400
                    text-sm
                    mb-1
                  ">
                    Health
                  </p>

                  <p className={
                    isUp
                      ? "text-emerald-400"
                      : "text-red-400"
                  }>

                    {isUp
                      ? "Operational"
                      : "Unavailable"}

                  </p>

                </div>

              </div>

            </motion.div>
          )

        })}

      </div>

    </div>
  );
}

export default App;