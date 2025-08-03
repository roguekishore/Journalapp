import MEDS from "./MEDS";
import SAS from "./SAS";
import '../css/SasMeds.css'

function SasMeds(){
    return(
        <div className="sasmeds-container">
            <SAS></SAS>
            <MEDS></MEDS>
        </div>
    )
}

export default SasMeds;