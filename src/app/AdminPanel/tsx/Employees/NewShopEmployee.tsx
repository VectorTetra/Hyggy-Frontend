import { postShopEmployee, putShopEmployee, useShopEmployeePost, useShopEmployeePut, useShopEmployees } from '@/pages/api/EmployeesApi';
import { Role, useRoleByName, useRolesByNames, useRolesExceptByRoleNames } from '@/pages/api/RoleApi';
import { ShopGetDTO, useShops } from '@/pages/api/ShopApi';
import { getDecodedToken } from '@/pages/api/TokenApi';
import useAdminPanelStore from '@/store/adminPanel';
import { ThemeProvider } from '@emotion/react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Autocomplete, Box, Button, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import Link from 'next/link';
import { useQueryState } from 'nuqs'; // Імпортуємо nuqs
import { useEffect, useState } from 'react';
import InputMask from 'react-input-mask';
import { toast } from 'react-toastify';
import themeFrame from '../ThemeFrame';

const USER_REGEX = /^[А-ЯЇЄІҐ][а-яїєіґ'"-]{1,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//const PHONE_REGEX = /^(\+?38)?0\d{9}$/;
//const PHONE_REGEX = /^\+38 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
const PHONE_REGEX = /^(\+?38)?(0\d{9}|\(\d{3}\) \d{3}-\d{2}-\d{2})$/;

const NewShopEmployee = ({ rolePermissions }) => {
    const [activeTab, setActiveTab] = useQueryState("at", { defaultValue: "shopEmployees", scroll: false, history: "push", shallow: true });
    const { shopEmployeeId, setShopEmployeeId } = useAdminPanelStore();

    const availableRoleNames = rolePermissions.getAvailableRolesForShopFrame(shopEmployeeId);

    const { data: roles = [], isLoading: rolesLoading } = useRolesByNames(
        availableRoleNames,
        availableRoleNames.length > 0
    );
    const { data: existingShopEmployee = [], refetch } = useShopEmployees({
        Id: shopEmployeeId! || null,
        PageNumber: 1,
        PageSize: 1000,
        Sorting: "NameAsc",
    }, shopEmployeeId !== "0" && shopEmployeeId !== null);
    const { mutateAsync: postShopEmployee } = useShopEmployeePost();
    const { mutateAsync: putShopEmployee } = useShopEmployeePut();
    const [selectedShop, setSelectedShop] = useState<ShopGetDTO | null>(null);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    const [name, setName] = useState("");
    const [nameError, setNameError] = useState("");
    const [validName, setValidName] = useState(false);

    const [surname, setSurname] = useState("");
    const [surnameError, setSurnameError] = useState("");
    const [validSurname, setValidSurname] = useState(false);

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [validEmail, setValidEmail] = useState(false);

    const [phone, setPhone] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [validPhone, setValidPhone] = useState(false);

    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [validPwd, setValidPwd] = useState(false);

    const [matchPwd, setMatchPwd] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [validMatch, setValidMatch] = useState(false);

    const [oldPassword, setOldPassword] = useState("");
    const [oldPasswordError, setOldPasswordError] = useState("");
    const [validOldPassword, setValidOldPassword] = useState(false);

    const [newPassword, setNewPassword] = useState("");
    const [newPasswordError, setNewPasswordError] = useState("");
    const [validNewPassword, setValidNewPassword] = useState(false);

    //const [shops, setShops] = useState<any | null>([]);
    const { data: shops = [] } = useShops({
        SearchParameter: "Query",
        PageNumber: 1,
        PageSize: 1000,
        Id: rolePermissions.IsAdmin ? Number(getDecodedToken()?.shopId) : null
    });

    // useEffect(() => {
    //     if (currentRole && roles.length > 0) {
    //         setSelectedRole(currentRole);
    //     }
    // }, [currentRole, roles]);

    useEffect(() => {
        if (shopEmployeeId === null) setActiveTab("shopEmployees");
        console.log("shopEmployeeId", shopEmployeeId);
    }, [shopEmployeeId, setActiveTab]);

    useEffect(() => {
        if (existingShopEmployee.length === 1 && shops.length > 0 && roles.length > 0) {
            console.log("existingShopEmployee", existingShopEmployee);
            console.log("Setting name to:", existingShopEmployee[0].name);
            setName(existingShopEmployee[0].name);
            setSurname(existingShopEmployee[0].surname);
            setEmail(existingShopEmployee[0].email);
            setPhone(existingShopEmployee[0].phoneNumber);
            let shop = shops.find(shop => shop.id === existingShopEmployee[0].shopId);
            setSelectedShop(shop);
            let role = (roles.find(role => role.name === existingShopEmployee[0].roleName));
            setSelectedRole(role);
        }
        else {
            if (shopEmployeeId !== "0") refetch();
        }
    }, [existingShopEmployee, shops, roles, shopEmployeeId, refetch]);


    const [isDisabled, setIsDisabled] = useState(true);

    const [showPwd, setShowPwd] = useState(false);
    const [showMatch, setShowMatch] = useState(false);
    const [showOldPwd, setShowOldPwd] = useState(false);
    const [showNewPwd, setShowNewPwd] = useState(false);

    useEffect(() => {
        if (shops && shops.length > 0) {
            setSelectedShop(shops[0])
        }
    }, [shops])

    useEffect(() => {
        const result = USER_REGEX.test(name);
        setNameError(result ? "" : "Ім'я має починатися з великої літери та містити лише літери або апостроф.");
        setValidName(result);
    }, [name])

    useEffect(() => {
        const result = USER_REGEX.test(surname);
        setSurnameError(result ? "" : "Прізвище має починатися з великої літери та містити лише літери або апостроф.");
        setValidSurname(result);
    }, [surname])

    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        setEmailError(result ? "" : "Невірний формат email.");
        setValidEmail(result);
    }, [email])

    useEffect(() => {
        const result = phone === "" || PHONE_REGEX.test(phone.replace(/[^\d+]/g, ''));
        setPhoneError(result ? "" : "Невірний формат номеру телефону.");
        setValidPhone(result);
    }, [phone])


    useEffect(() => {
        const result = PWD_REGEX.test(password);
        setPasswordError(result ? "" : "Довжина паролю від 8 до 24 символів. Пароль має містити велику літеру, малу літеру та цифру.");
        setValidPwd(result);
        const match = password == matchPwd;
        setConfirmPasswordError(match ? "" : "Паролі не співпадають.");
        setValidMatch(match);
    }, [password, matchPwd]);

    useEffect(() => {
        // Перевірка для старого пароля
        const resultOldPassword = oldPassword === "" || PWD_REGEX.test(oldPassword);
        setOldPasswordError(resultOldPassword ? "" : "(Залиште поле порожнім, якщо не хочете змінювати пароль)");
        setValidOldPassword(resultOldPassword);
    }, [oldPassword]);

    useEffect(() => {
        // Перевірка для нового пароля
        const resultNewPassword = newPassword === "" || PWD_REGEX.test(newPassword);
        setNewPasswordError(resultNewPassword ? "" : "Довжина паролю від 8 до 24 символів. Пароль має містити велику літеру, малу літеру та цифру. (Залиште поле порожнім, якщо не хочете змінювати пароль)");
        setValidNewPassword(resultNewPassword);
    }, [newPassword]);

    useEffect(() => {
        // Оновлення валідності кнопки збереження
        if (shopEmployeeId === "0" && validName && validPwd && validMatch && validEmail && validSurname && validPhone && selectedShop && selectedRole) {
            setIsDisabled(false);
        }
        else if (shopEmployeeId !== "0" && validName && validEmail && validSurname && validPhone && (validOldPassword || oldPassword === "") && (validNewPassword || newPassword === "") && selectedShop && selectedRole) {
            setIsDisabled(false);
        }
        else {
            setIsDisabled(true);
            console.log("isDisabled", isDisabled);
            console.log("validName", validName);
            console.log("validSurname", validSurname);
            console.log("validPwd", validPwd);
            console.log("validMatch", validMatch);
            console.log("validEmail", validEmail);
            console.log("validPhone", validPhone);
            console.log("selectedShop", selectedShop);
            console.log("selectedRole", selectedRole);
            console.log("validOldPassword", validOldPassword);
            console.log("validNewPassword", validNewPassword);
        }
    }, [validEmail, validSurname, validMatch, validName, validPwd, validPhone, validOldPassword, validNewPassword, oldPassword, newPassword, selectedShop, selectedRole, shopEmployeeId]);


    async function handleSubmit(e) {
        e.preventDefault();
        if (!selectedShop) return;
        try {
            if (shopEmployeeId === "0") {
                //Додавання співробітника
                const response = await postShopEmployee({
                    Name: name, Surname: surname, Email: email, PhoneNumber: phone.replace(/[^\d+]/g, '') ?? null, Password: password, ConfirmPassword: matchPwd,
                    ShopId: selectedShop!.id, RoleName: selectedRole!.name
                });
                toast.success("Співробітник успішно доданий!");
            }
            else {
                //Редагування співробітника
                const response = await putShopEmployee({
                    Id: shopEmployeeId!, Name: name, Surname: surname, Email: email, PhoneNumber: phone.replace(/[^\d+]/g, '') ?? null, NewPassword: newPassword, OldPassword: oldPassword,
                    ShopId: selectedShop!.id, RoleName: selectedRole!.name
                });
                toast.success("Співробітник успішно відредагований!");
            }
        } catch (error) {
            console.error(error.text);
            toast.dismiss();
            toast.error(error.response);
        } finally {
            setActiveTab('shopEmployees');
        }
    }

    return (
        <ThemeProvider theme={themeFrame}>
            <Box component="form" onSubmit={handleSubmit}>
                <Typography variant="h5" gutterBottom>
                    {shopEmployeeId === "0" ? "Додати нового співробітника магазину" : "Редагувати співробітника магазину"}
                </Typography>
                <TextField
                    label="Ім&apos;я"
                    name="firstName"
                    value={name}
                    error={name.length > 0 && !validName}
                    helperText={<span>{nameError}</span>}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Прізвище"
                    name="lastName"
                    value={surname}
                    helperText={<span>{surnameError}</span>}
                    onChange={(e) => setSurname(e.target.value)}
                    error={surname.length > 0 && !validSurname}
                    fullWidth
                    margin="normal"
                />

                <TextField
                    label="Email"
                    name="email"
                    value={email}
                    helperText={
                        <span>{emailError}</span>
                    }
                    error={email.length > 0 && !validEmail}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    margin="normal"
                    disabled={existingShopEmployee.length > 0}
                />
                <InputMask
                    mask="+38 (099) 999-99-99"
                    value={phone}
                    helperText={
                        <span>{phoneError}</span>
                    }
                    errorMessage="Невірний формат номеру телефону"
                    onChange={(e) => setPhone(e.target.value)}
                >
                    {() => (
                        <TextField
                            label="Номер телефону"
                            name="phoneNumber"
                            fullWidth
                            margin="normal"
                            value={phone}
                        />
                    )}
                </InputMask>
                {shopEmployeeId === "0" && <div>
                    <TextField
                        label="Пароль"
                        name="password"
                        helperText={
                            <span>{passwordError}</span>
                        }
                        type={showPwd ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={password.length > 0 && !validPwd}
                        fullWidth
                        margin="normal"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPwd(!showPwd)}
                                    >
                                        {showPwd ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        label="Повторіть пароль"
                        name="confirmPassword"
                        type={showMatch ? "text" : "password"}
                        value={matchPwd}
                        helperText={
                            <span>{confirmPasswordError}</span>
                        }
                        onChange={(e) => setMatchPwd(e.target.value)}
                        error={matchPwd.length > 0 && !validMatch}
                        fullWidth
                        margin="normal"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowMatch(!showMatch)}
                                    >
                                        {showMatch ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>}

                {shopEmployeeId !== "0" && getDecodedToken()?.nameid === shopEmployeeId && <div >
                    <TextField
                        label="Cтарий пароль"
                        name="oldPassword"
                        type={showOldPwd ? "text" : "password"}
                        value={oldPassword}
                        helperText={
                            <span>{oldPasswordError}</span>
                        }
                        onChange={(e) => setOldPassword(e.target.value)}
                        error={oldPassword.length > 0 && !validOldPassword}
                        fullWidth
                        margin="normal"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowOldPwd(!showOldPwd)}
                                    >
                                        {showOldPwd ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        label="Новий пароль"
                        name="confirmPassword"
                        type={showNewPwd ? "text" : "password"}
                        value={newPassword}
                        helperText={
                            <span>{newPasswordError}</span>
                        }
                        onChange={(e) => setNewPassword(e.target.value)}
                        error={newPassword.length > 0 && !validNewPassword}
                        fullWidth
                        margin="normal"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowNewPwd(!showNewPwd)}
                                    >
                                        {showNewPwd ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Link href="../PagePasswordReset" prefetch><span style={{ color: '#00AAAD', textDecoration: "none" }}>Забули пароль?</span> </Link>
                </div>}
                <Autocomplete
                    options={shops}
                    getOptionLabel={(option: ShopGetDTO) => `${option?.name} (${option?.city}, ${option?.street}, ${option?.houseNumber})`}
                    value={selectedShop}
                    onChange={(event, newValue) => setSelectedShop(newValue)}
                    renderInput={(params) => <TextField {...params} label="Виберіть магазин" variant="outlined" fullWidth margin="normal" />}
                    isOptionEqualToValue={(option, value) => option?.id === value?.id}
                />
                {roles.length > 0 && <Autocomplete
                    options={roles}
                    getOptionLabel={(option: Role) => `${option?.name}`}
                    value={selectedRole}
                    onChange={(event, newValue) => setSelectedRole(newValue)}
                    renderInput={(params) => <TextField {...params} label="Виберіть посаду" variant="outlined" fullWidth margin="normal" />}
                    isOptionEqualToValue={(option, value) => option?.id === value?.id}
                />}
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}
                    disabled={isDisabled}>
                    {shopEmployeeId === "0" ? "Додати співробітника" : "Зберегти зміни"}
                </Button>
            </Box>
        </ThemeProvider>
    )
}

export default NewShopEmployee