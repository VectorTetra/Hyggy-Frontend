function MainPageBorder(props) {
     const [currentIndex, setCurrentIndex] = React.useState(0);

    // Функция для перехода к следующему баннеру
      const nextBanner = () => {
          setCurrentIndex((prevIndex) => 
              (prevIndex + 1) % props.borderData.mainBorder.length
          );
      };

     // Функция для перехода к предыдущему баннеру
      const prevBanner = () => {
          setCurrentIndex((prevIndex) => 
              (prevIndex - 1 + props.borderData.mainBorder.length) % props.borderData.mainBorder.length
          );
      };

    // Автоматическое переключение баннера каждые 2 секунды
      React.useEffect(() => {
          const interval = setInterval(nextBanner, 5000);
          return () => clearInterval(interval); // Очистка интервала при размонтировании
     }, []);

    return (
        <div className="mainPageBorder">
        <div className="mainPageBorder-container">
            <button onClick={prevBanner}>{"<<"}</button> 
            <a style={{width: "100%"}} href={props.borderData.mainBorder[currentIndex].urlpage}>
                <img className="mainPageBorder-containerimg" src={props.borderData.mainBorder[currentIndex].url} />
            </a>
            <button onClick={nextBanner}>{">>"}</button> 
        </div>
        </div>
    );
}
