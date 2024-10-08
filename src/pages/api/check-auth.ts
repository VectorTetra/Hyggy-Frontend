export default async function handler(req, res) {
	const token = req.headers.authorization?.split(' ')[1]; // Або витягуємо токен з сесії

	if (!token) {
		return res.status(401).json({ message: 'Неавторизований' });
	}

	try {
		// Перевірка токена через ваш API
		const response = await fetch('https://your-api-url/api/employee/validate-token', {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (response.ok) {
			res.status(200).json({ message: 'Авторизований' });
		} else {
			res.status(401).json({ message: 'Невірний токен' });
		}
	} catch (error) {
		res.status(500).json({ message: 'Помилка сервера' });
	}
}
