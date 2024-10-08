export default async function handler(req, res) {
	if (req.method === 'POST') {
		const { Email, Password } = req.body;

		try {
			const response = await fetch('https://your-api-url/api/employee/authenticate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ Email, Password }),
			});

			const data = await response.json();

			if (response.ok) {
				res.status(200).json(data); // Повертаємо токен або інфо про користувача
			} else {
				res.status(401).json({ message: data.error || 'Невірні дані' });
			}
		} catch (error) {
			res.status(500).json({ message: 'Помилка сервера' });
		}
	} else {
		res.status(405).json({ message: 'Метод не дозволений' });
	}
}
