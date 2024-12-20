import "./Skeleton.css"
const Skeleton = ({ classes }) => {

    const classNames = `skeleton ${classes} animate-pulse`
    //console.log("Css Classes" + classNames);

    return <div className={classNames}></div>
}

export default Skeleton