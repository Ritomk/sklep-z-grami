import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { ArrowLeft, Loader } from "lucide-react";

interface FieldErrs {
  email?: string;
  nickname?: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  password?: string;
  passwordRepeat?: string;
  nonField?: string;
}

export default function Register() {
  const navigate = useNavigate();

  /* formularz */
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nickname, setNickname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [agreed, setAgreed] = useState(false);

  /* UI / walidacja */
  const [fieldErrs, setFieldErrs] = useState<FieldErrs>({});
  const [loading, setLoading] = useState(false);

  const validateEmail = (mail: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);

  /* prosta walidacja po stronie klienta */
  const runValidation = (): FieldErrs => {
    const errs: FieldErrs = {};

    if (!validateEmail(email)) errs.email = "Nieprawidłowy e-mail.";
    if (nickname.length < 3) errs.nickname = "Min. 3 znaki.";
    if (!firstName.trim()) errs.firstName = "Podaj imię.";
    if (!lastName.trim()) errs.lastName = "Podaj nazwisko.";
    if (!birthDate) errs.birthDate = "Podaj datę urodzenia.";
    if (password.length < 8) errs.password = "Min. 8 znaków.";
    if (password !== passwordRepeat)
      errs.passwordRepeat = "Hasła nie są zgodne.";
    if (!agreed) errs.nonField = "Zaakceptuj EULA.";

    return errs;
  };

  const formValid = Object.keys(runValidation()).length === 0 && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = runValidation();
    if (Object.keys(errs).length) {
      setFieldErrs(errs);
      return;
    }

    try {
      setLoading(true);
      await api.post("register/", {
        email,
        first_name: firstName,
        last_name: lastName,
        nickname,
        birth_date: birthDate,
        password,
      });

      /* auto-login po rejestracji */
      const { data } = await api.post("token/", { email, password });
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      navigate("/");
    } catch (err: any) {
      if (err.response?.data) {
        const apiErrs: FieldErrs = {};
        Object.entries(err.response.data).forEach(([k, v]: any) => {
          if (Array.isArray(v) && v.length) {
            if (["email", "nickname"].includes(k)) apiErrs[k as keyof FieldErrs] = v[0];
            else apiErrs.nonField = v[0];
          }
        });
        setFieldErrs(apiErrs);
      } else {
        setFieldErrs({ nonField: "Wystąpił błąd rejestracji." });
      }
    } finally {
      setLoading(false);
    }
  };

  /* helpers do wyświetlania błędów przy polach */
  const err = (name: keyof FieldErrs) =>
    fieldErrs[name] && (
      <p className="text-red-500 text-sm mt-1">{fieldErrs[name]}</p>
    );

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center px-4">
      <div className="flex w-full max-w-4xl shadow-2xl rounded-2xl overflow-hidden bg-neutral-800 flex-col md:flex-row">
        {/* lewy panel */}
        <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-yellow-600 to-yellow-400">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            Join GamesCatalog
          </h2>
          <p className="text-lg text-neutral-900">
            Create your account and build your ultimate game library!
          </p>
        </div>

        {/* prawy panel */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-3 py-2 rounded text-neutral-400 hover:bg-neutral-700 hover:text-yellow-400 transition w-fit mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Go back</span>
          </button>

          <h2 className="text-2xl font-bold text-yellow-400 text-center mb-6">
            Register
          </h2>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 w-full"
            noValidate
          >
            {/* nickname */}
            <div>
              <input
                type="text"
                placeholder="Nickname"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-neutral-700 text-yellow-200 placeholder-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              {err("nickname")}
            </div>

            {/* imię + nazwisko */}
            <div className="flex flex-col md:flex-row gap-2">
              <div className="w-full md:w-1/2">
                <input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-neutral-700 text-yellow-200 placeholder-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                {err("firstName")}
              </div>
              <div className="w-full md:w-1/2">
                <input
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-neutral-700 text-yellow-200 placeholder-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                {err("lastName")}
              </div>
            </div>

            {/* data urodzenia */}
            <div>
              <input
                type="date"
                placeholder="Birth date"
                value={birthDate}
                onChange={e => setBirthDate(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-neutral-700 text-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                max={new Date().toISOString().split("T")[0]}
              />
              {err("birthDate")}
            </div>

            {/* email */}
            <div>
              <input
                type="email"
                placeholder="Email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-neutral-700 text-yellow-200 placeholder-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              {err("email")}
            </div>

            {/* hasła */}
            <div>
              <input
                type="password"
                placeholder="Password (min. 8 znaków)"
                autoComplete="new-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-neutral-700 text-yellow-200 placeholder-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              {err("password")}
            </div>
            <div>
              <input
                type="password"
                placeholder="Repeat password"
                autoComplete="new-password"
                value={passwordRepeat}
                onChange={e => setPasswordRepeat(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-neutral-700 text-yellow-200 placeholder-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              {err("passwordRepeat")}
            </div>

            {/* EULA */}
            <label className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="accent-yellow-500"
                required
              />
              <span className="text-neutral-300 text-sm">
                I accept the{" "}
                <a
                  href="#"
                  className="text-yellow-400 underline hover:text-yellow-300"
                >
                  End User License Agreement
                </a>
                .
              </span>
            </label>
            {err("nonField")}

            {/* submit */}
            <button
              type="submit"
              disabled={!formValid}
              className="bg-yellow-500 disabled:bg-yellow-800 transition text-neutral-900 font-bold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2"
            >
              {loading && <Loader className="w-4 h-4 animate-spin" />}
              Register
            </button>
          </form>

          <div className="text-center mt-4">
            <span className="text-neutral-400">Already have an account?</span>{" "}
            <a
              href="/login"
              className="text-yellow-400 font-bold hover:underline"
            >
              Sign in here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
