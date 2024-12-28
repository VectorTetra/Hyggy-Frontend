import styles from "@/app/sharedComponents/css/SidebarBlockHeader.module.css";

interface SidebarBlockHeaderProps {
	title: string;
	setIsSidebarBlockOpen: (isOpen: boolean) => void;
	isSidebarBlockOpen: boolean;
}

const SidebarBlockHeader: React.FC<SidebarBlockHeaderProps> = ({ setIsSidebarBlockOpen, isSidebarBlockOpen, title }) => {
	return (
		<div className={styles.sidebarBlockContainer} onClick={() => setIsSidebarBlockOpen(!isSidebarBlockOpen)}>
			<div className={styles.sidebarBlockHeader}>
				{title}
			</div>
			<div className={styles.sidebarBlockArrow}>
				{isSidebarBlockOpen ?
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
						<path d="M12 16L6 10h12l-6 6z" />
					</svg>
					:
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
						<path d="M10 6l6 6-6 6V6z" />
					</svg>
				}
			</div>
		</div>
	);
}
export default SidebarBlockHeader;