import { postShopEmployee } from '@/pages/api/EmployeesApi';
import { getShops } from '@/pages/api/ShopApi';
import { faEye, faEyeSlash, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSearchParams } from 'next/navigation';
import { useQueryState } from 'nuqs'; // Імпортуємо nuqs
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

const USER_REGEX = /^[А-ЯЇЄІҐ][а-яїєіґ]{1,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^(\+?38)?0\d{9}$/;

const NewShopEmployee = () => {
    const searchParams = useSearchParams();
    const id = searchParams?.get("shopemployee");

    const userRef = useRef<HTMLInputElement>(null);

    const [name, setName] = useState("");
    const [validName, setValidName] = useState(false);
    const [nameFocus, setNameFocus] = useState(false);

    const [surname, setSurname] = useState("");
    const [validSurname, setValidSurname] = useState(false);
    const [surnameFocus, setSurnameFocus] = useState(false);

    const [email, setEmail] = useState("");
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [phone, setPhone] = useState("");
    const [validPhone, setValidPhone] = useState(false);
    const [phoneFocus, setPhoneFocus] = useState(false);

    const [password, setPassword] = useState("");
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState("");
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [shops, setShops] = useState<any | null>([]);
    const [shopId, setShopId] = useState(0);

    const [errMsg, setErrMsg] = useState('');

    const [isDisabled, setIsDisabled] = useState(true);
    const [activeTab, setActiveTab] = useQueryState("at", { defaultValue: "shopEmployees", scroll: false, history: "push", shallow: true });

    const [showPwd, setShowPwd] = useState(false);
    const [showMatch, setShowMatch] = useState(false);

    useEffect(() => {
        userRef.current?.focus();
        const fetchStorages = async () => {
            try {
                const data = await getShops({
                    SearchParameter: "Query",
                    PageNumber: 1,
                    PageSize: 150
                });
                setShops(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchStorages();
        //shops.length === 0 ?  fetchStorages() : ;
    }, [])

    useEffect(() => {
        if (shops && shops.length > 0) {
            setShopId(shops[0].id)
        }
    }, [shops])

    useEffect(() => {
        const result = USER_REGEX.test(name);
        setValidName(result);
    }, [name])

    useEffect(() => {
        const result = USER_REGEX.test(surname);
        setValidSurname(result);
    }, [surname])

    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        setValidEmail(result);
    }, [email])

    useEffect(() => {
        const result = PHONE_REGEX.test(phone);
        setValidPhone(result);
    }, [phone])

    useEffect(() => {
        const result = PWD_REGEX.test(password);
        setValidPwd(result);
        const match = password == matchPwd;
        setValidMatch(match);
    }, [password, matchPwd]);

    useEffect(() => {
        if (validName && validPwd && validMatch && validEmail && validSurname && validPhone) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }

    }, [validEmail, validSurname, validMatch, validName, validPwd, validPhone])

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (id === "0") {
                //Додавання співробітника
                const response = await postShopEmployee({
                    Name: name, Surname: surname, Email: email, Phone: phone, Password: password, ConfirmPassword: matchPwd,
                    ShopId: shopId
                });
                toast.success(response);
            }
        } catch (error) {
            console.error(error.text);
            toast.error(error.response);
        } finally {
            setActiveTab('shopEmployees');
        }
    }


    return (
        <form onSubmit={handleSubmit} className="flex flex-col max-w-sm mx-auto  gap-4">
            <div>
                <label className="form-label" htmlFor="name">Ім&apos;я:</label>
                <input
                    id="name"
                    className="w-full border p-2 rounded"
                    type="text"
                    placeholder="Укажіть ім'я"
                    ref={userRef}
                    autoComplete="off"
                    onChange={e => setName(e.target.value)}
                    aria-invalid={validName ? "false" : "true"}
                    aria-describedby="uidnote"
                    onFocus={() => setNameFocus(true)}
                    onBlur={() => setNameFocus(false)}
                />
                <p id="uidnote" className={nameFocus && name && !validName ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} className="text-[#FF385C] opacity-60/" />
                    <span className="text-[#FF385C] opacity-60">Від 2 до 24 символів(тільки літери). Повинно починатися з великої літери.</span>
                </p>

                <label className="form-label" htmlFor="surname">Прізвище:</label>
                <input
                    id="surname"
                    className="w-full border p-2 rounded"
                    type="text"
                    autoComplete="off"
                    placeholder="Укажіть прізвище"
                    value={surname}
                    onChange={e => setSurname(e.target.value)}
                    aria-invalid={validSurname ? "false" : "true"}
                    aria-describedby="surnote"
                    onFocus={() => setSurnameFocus(true)}
                    onBlur={() => setSurnameFocus(false)}
                />
                <p id="surnote" className={surnameFocus && surname && !validSurname ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} className="text-[#FF385C] opacity-60/" />
                    <span className="text-[#FF385C] opacity-60">Від 2 до 24 символів(тільки літери). Повинно починатися з великої літери.</span>
                </p>
                <label className="form-label" htmlFor="email">Пошта:</label>
                <input
                    id="email"
                    className="w-full border p-2 rounded"
                    type="email"
                    placeholder="Укажіть пошту"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    aria-invalid={validSurname ? "false" : "true"}
                    aria-describedby="emnote"
                    onFocus={() => setEmailFocus(true)}
                    onBlur={() => setEmailFocus(false)}
                />
                <p id="emnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} className="text-[#FF385C] opacity-60/" />
                    <span className="text-[#FF385C] opacity-60">Пошта не співпадає з шаблоном(yourname@email.com)</span>
                </p>
                <label className="form-label" htmlFor="phone">Телефон:</label>
                <input
                    id="phone"
                    className="w-full border p-2 rounded"
                    type="phone"
                    placeholder="Укажіть телефон"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    aria-invalid={validPhone ? "false" : "true"}
                    aria-describedby="phnote"
                    onFocus={() => setPhoneFocus(true)}
                    onBlur={() => setPhoneFocus(false)}
                />
                <p id="phnote" className={phoneFocus && phone && !validPhone ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} className="text-[#FF385C] opacity-60/" />
                    <span className="text-[#FF385C] opacity-60">Приклад: +380123456789, 380123456789, 0123456789</span>
                </p>
                <label className="form-label" htmlFor="pwd">Пароль:</label>
                <div className="relative w-full">
                    <input
                        id="pwd"
                        className="w-full border p-2 rounded"
                        type={showPwd ? "text" : "password"}
                        autoComplete="off"
                        placeholder="Укажіть пароль"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        aria-invalid={validPwd ? "false" : "true"}
                        aria-describedby="pwdnote"
                        onFocus={() => setPwdFocus(true)}
                        onBlur={() => setPwdFocus(false)}
                    />
                    <button
                        className="absolute right-2 top-2 text-gray-600"
                        type="button"
                        onClick={() => setShowPwd(!showPwd)}
                        onFocus={() => setPwdFocus(true)}
                        onBlur={() => setPwdFocus(false)}
                    >
                        <FontAwesomeIcon icon={showPwd ? faEyeSlash : faEye} />
                    </button>
                </div>
                <p id="pwdnote" className={pwdFocus && password && !validPwd ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} className="text-[#FF385C] opacity-60/" />
                    <span className="text-[#FF385C] opacity-60">Від 8 символів(тільки літери та цифри).Має містити, як найменш одну велику літеру та цифру.</span>
                </p>
                <label className="form-label" htmlFor="match">Підтвердження паролю:</label>
                <div className="relative w-full">
                    <input
                        id="match"
                        className="w-full border p-2 rounded"
                        type={showMatch ? "text" : "password"}
                        autoComplete="off"
                        placeholder="Підтвердіть пароль"
                        value={matchPwd}
                        onChange={e => setMatchPwd(e.target.value)}
                        aria-invalid={validMatch ? "false" : "true"}
                        aria-describedby="matchnote"
                        onFocus={() => setMatchFocus(true)}
                        onBlur={() => setMatchFocus(false)}
                    />
                    <button
                        className="absolute right-2 top-2 text-gray-600"
                        type="button"
                        onClick={() => setShowMatch(!showMatch)}
                        onFocus={() => setMatchFocus(true)}
                        onBlur={() => setMatchFocus(false)}
                    >
                        <FontAwesomeIcon icon={showMatch ? faEyeSlash : faEye} />
                    </button>
                </div>
                <p id="matchnote" className={matchFocus && matchPwd && !validMatch ? "instructions" : "offscreen"}>
                    <FontAwesomeIcon icon={faInfoCircle} className="text-[#FF385C] opacity-60/" />
                    <span className="text-[#FF385C] opacity-60">Пароль не співпадає.</span>
                </p>
                <label className="form-label" htmlFor="address">Адреса магазину:</label>
                <select
                    name="address"
                    id="address"
                    className="w-full border p-2 rounded"
                    value={shopId}
                    onChange={e => setShopId(Number(e.target.value))}
                >
                    {shops && shops.map((shop) => (
                        <option key={shop.id} value={shop.id}>{shop.street + ' ' + shop.houseNumber + ' , ' + shop.city}</option>
                    ))}
                </select>
            </div>
            {isDisabled ? (
                <button disabled={true} className="bg-[#00AAAD] opacity-50 cursor-not-allowed text-white text-xl font-bold rounded-xl shadow-xl py-4 w-full">Додати співробітника</button>)
                : (
                    <button className="bg-[#00AAAD]  text-white text-xl font-bold rounded-xl shadow-xl py-4 w-full">Додати співробітника</button>
                )
            }
        </form>
    )
}

export default NewShopEmployee