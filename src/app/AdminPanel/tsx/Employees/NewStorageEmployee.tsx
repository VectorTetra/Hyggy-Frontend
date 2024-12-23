import { useStorageEmployeePost, useStorageEmployeePut, useStorageEmployees } from '@/pages/api/EmployeesApi';
import { Role, useRolesByNames } from '@/pages/api/RoleApi';
import { useStorages } from '@/pages/api/StorageApi';
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


const NewStorageEmployee = ({ rolePermissions }) => {
    const [activeTab, setActiveTab] = useQueryState("at", { defaultValue: "storageEmployees", scroll: false, history: "push", shallow: true });
    const { storageEmployeeId } = useAdminPanelStore();
    console.log(storageEmployeeId);
    const availableRoleNames = rolePermissions.getAvailableRolesForStorageFrame(storageEmployeeId);

    const { data: roles = [], isLoading: rolesLoading } = useRolesByNames(
        availableRoleNames,
        availableRoleNames.length > 0
    );
    const { data: existingStorageEmployee = [], refetch } = useStorageEmployees({
        Id: storageEmployeeId! || null,
        PageNumber: 1,
        PageSize: 1000,
        Sorting: "NameAsc",
    }, storageEmployeeId !== "0" && storageEmployeeId !== null);
    const { mutateAsync: postStorageEmployee } = useStorageEmployeePost();
    const { mutateAsync: putStorageEmployee } = useStorageEmployeePut();

    const [selectedStorage, setSelectedStorage] = useState<Storage | null>(null);
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

    const { data: storages = [] } = useStorages({
        SearchParameter: "Query",
        PageNumber: 1,
        PageSize: 1000,
        Id: rolePermissions.IsAdmin ? Number(getDecodedToken()?.storageId) : null
    });

    useEffect(() => {
        if (storageEmployeeId === null) setActiveTab("storageEmployees");
    }, [storageEmployeeId, setActiveTab]);

    useEffect(() => {
        if (existingStorageEmployee.length === 1 && storages.length > 0 && roles.length > 0) {
            setName(existingStorageEmployee[0].name);
            setSurname(existingStorageEmployee[0].surname);
            setEmail(existingStorageEmployee[0].email);
            setPhone(existingStorageEmployee[0].phoneNumber);
            let storage = storages.find(storage => storage.id === existingStorageEmployee[0].storageId);
            setSelectedStorage(storage);
            let role = (roles.find(role => role.name === existingStorageEmployee[0].roleName));
            setSelectedRole(role);
        }
        else {
            if (storageEmployeeId !== "0") refetch();
        }
    }, [existingStorageEmployee, storages, roles, storageEmployeeId, refetch]);


    const [isDisabled, setIsDisabled] = useState(true);

    const [showPwd, setShowPwd] = useState(false);
    const [showMatch, setShowMatch] = useState(false);
    const [showOldPwd, setShowOldPwd] = useState(false);
    const [showNewPwd, setShowNewPwd] = useState(false);

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
        if (storageEmployeeId === "0" && validName && validPwd && validMatch && validEmail && validSurname && validPhone && selectedStorage && selectedRole) {
            setIsDisabled(false);
        }
        else if (storageEmployeeId !== "0" && validName && validEmail && validSurname && validPhone && (validOldPassword || oldPassword === "") && (validNewPassword || newPassword === "") && selectedStorage && selectedRole) {
            setIsDisabled(false);
        }
        else {
            setIsDisabled(true);
        }
    }, [validEmail, validSurname, validMatch, validName, validPwd, validPhone, validOldPassword, validNewPassword, oldPassword, newPassword, selectedStorage, selectedRole, storageEmployeeId]);


    async function handleSubmit(e) {
        e.preventDefault();
        if (!selectedStorage) return;
        try {
            if (storageEmployeeId === "0") {
                //Додавання співробітника
                const response = await postStorageEmployee({
                    Name: name, Surname: surname, Email: email, PhoneNumber: phone.replace(/[^\d+]/g, '') ?? null, Password: password, ConfirmPassword: matchPwd,
                    StorageId: selectedStorage!.id, RoleName: selectedRole!.name
                });
                toast.success("Співробітник успішно доданий!");
            }
            else {
                //Редагування співробітника
                const response = await putStorageEmployee({
                    Id: storageEmployeeId!, Name: name, Surname: surname, Email: email, PhoneNumber: phone.replace(/[^\d+]/g, '') ?? null, NewPassword: newPassword, OldPassword: oldPassword,
                    StorageId: selectedStorage!.id, RoleName: selectedRole!.name
                });
                toast.success("Співробітник успішно відредагований!");
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error.response);
        } finally {
            setActiveTab('storageEmployees');
        }
    }

    return (
        <ThemeProvider theme={themeFrame}>
            <Box component="form" onSubmit={handleSubmit}>
                <Typography variant="h5" gutterBottom>
                    {storageEmployeeId === "0" ? "Додати нового співробітника складу" : "Редагувати співробітника складу"}
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
                    helperText={
                        <span>
                            {surnameError}
                        </span>
                    }
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
                        <span>
                            {emailError}
                        </span>
                    }
                    error={email.length > 0 && !validEmail}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    margin="normal"
                    disabled={existingStorageEmployee.length > 0}
                />
                <InputMask
                    mask="+38 (099) 999-99-99"
                    value={phone}
                    helperText={
                        <span>
                            {phoneError}
                        </span>
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
                        />
                    )}
                </InputMask>
                {storageEmployeeId === "0" && <div>
                    <TextField
                        label="Пароль"
                        name="password"
                        helperText={
                            <span>
                                {passwordError}
                            </span>
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
                            <span>
                                {confirmPasswordError}
                            </span>
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

                {storageEmployeeId !== "0" && getDecodedToken()?.nameid === storageEmployeeId && <div >
                    <TextField
                        label="Cтарий пароль"
                        name="oldPassword"
                        type={showOldPwd ? "text" : "password"}
                        value={oldPassword}
                        helperText={
                            <span>
                                {oldPasswordError}
                            </span>
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
                            <span>
                                {newPasswordError}
                            </span>
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
                    options={storages}
                    getOptionLabel={(option: Storage) => `${option?.shopName} (${option?.city}, ${option?.street}, ${option?.houseNumber})`}
                    value={selectedStorage}
                    onChange={(event, newValue) => setSelectedStorage(newValue)}
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
                    {storageEmployeeId === "0" ? "Додати співробітника" : "Зберегти зміни"}
                </Button>
            </Box>
        </ThemeProvider>
    )
}

export default NewStorageEmployee