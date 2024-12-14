"use client";
import { ShopGetDTO } from "@/pages/api/ShopApi";
import { useState } from "react";
import useMainPageMenuShops from "@/store/mainPageMenuShops";
import Link from "next/link";
import styles from "@/app/sharedComponents/css/ShopStatusOuter.module.css"
import useLocalStorageStore from "@/store/localStorage";
import { useRouter } from "next/navigation";

const checkShopStatus = (workHours: string) => {
	const currentDate = new Date();
	const currentDay = currentDate.toLocaleString("uk-UA", { weekday: "long" });
	const currentTime = currentDate.getHours() * 60 + currentDate.getMinutes();

	const workHoursArray = workHours.split("|").map((day) => {
		const [dayweek, hours] = day.split(",");
		const [open, close] = hours.split(" - ");
		return { dayweek: dayweek.trim(), open: open.trim(), close: close.trim() };
	});

	const todayWorktime = workHoursArray.find((time) => time.dayweek.toLocaleLowerCase() === currentDay.toLocaleLowerCase());
	if (todayWorktime) {
		const [openHour, openMinute] = todayWorktime.open.split(":").map(Number);
		const [closeHour, closeMinute] = todayWorktime.close.split(":").map(Number);
		const openMinutes = openHour * 60 + openMinute;
		const closeMinutes = closeHour * 60 + closeMinute;

		if (currentTime >= openMinutes && currentTime < closeMinutes) {
			return (
				<span style={{ marginLeft: "10px" }}>
					<span style={{ color: "green", fontWeight: "bold", fontSize: "0.9em" }}>Відчинено:</span>
					<span style={{ fontSize: "0.9em", marginLeft: "5px" }}> Зачиняється о {todayWorktime.close}</span>
				</span>
			);
		} else {
			return (
				<span style={{ marginLeft: "10px" }}>
					<span style={{ color: "red", fontWeight: "bold", fontSize: "0.9em" }}>Зачинено:</span>
					<span style={{ fontSize: "0.9em" }}> Відкриється о {todayWorktime.open}</span>
				</span>
			);
		}
	}
	return "Час роботи не доступний";
};

const ShopStatusOuter = ({ shop }: { shop: ShopGetDTO }) => {
	const { isMainPageMenuShopsOpened, setIsMainPageMenuShopsOpened } = useMainPageMenuShops();
	const { setShopToViewOnShopPage } = useLocalStorageStore();
	const [isDetailsOpen, setIsDetailsOpen] = useState(false);
	const router = useRouter();
	const toggleWorkHours = () => {
		setIsDetailsOpen(!isDetailsOpen);
	};

	const parsedWorkHours = shop.workHours ? shop.workHours.split("|").map((day) => {
		const [dayweek, hours] = day.split(",");
		const [open, close] = hours.split(" - ");
		return { dayweek: dayweek.trim(), open: open.trim(), close: close.trim() };
	}) : [];

	if (!isMainPageMenuShopsOpened) return null;
	return (
		<div className={styles.ShopStatusOuterWrapper} >
			<div className={styles.ShopStatusOuterCard} >
				<div>{shop.workHours ? checkShopStatus(shop.workHours) : "Час роботи не доступний"}</div>
				<span
					onClick={toggleWorkHours}
					style={{
						margin: "10px 15px 10px 0",
						color: "#007bff",
						textDecoration: "underline",
						cursor: "pointer",
						fontSize: "14px",
					}}
				>
					Робочі години
				</span>
			</div>
			{isDetailsOpen && (
				<div className={styles.ShopStatusOuterDetails} >
					<div>
						<p style={{ fontWeight: "bold" }}>Інформація про магазин:</p>
						<div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
							<strong>Адреса:</strong>
							<span style={{ marginLeft: "50px" }}>
								{shop.street},
								<p style={{ marginBottom: 0 }}>{shop.city}</p>
								<Link prefetch={true} className={styles.customlink} href="/shops">Як знайти магазин</Link>
							</span>
						</div>
					</div>
					<div style={{ display: "flex", margin: "20px 0 10px 0", flexDirection: "column" }}>
						<p style={{ fontWeight: "bold", marginBottom: "10px" }}>Робочі години:</p>
						<ul className={styles.worktimelist}>
							{parsedWorkHours.map((time, index) => (
								<li key={index} className={styles.worktimeitem}>
									<span className={styles.worktimeday}>{time.dayweek}:</span>
									<span style={{ fontSize: "14px" }}>{time.open} - {time.close}</span>
								</li>
							))}
						</ul>
						<button className={styles.customlink2} onClick={() => {
							setShopToViewOnShopPage(shop);
							setIsMainPageMenuShopsOpened(false);
							router.push("/shop");
						}} >Показати магазин</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default ShopStatusOuter;