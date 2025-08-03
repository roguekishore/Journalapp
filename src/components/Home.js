import Tracker from "../trackers/Trackers";
import TradingLogSheet from "./TradingLogSheet";
import '../css/Home.css'
import KawasakiNinjaZX10R from "./Kawasaki";

function Home(){
  return(
    <div className="home">
      <TradingLogSheet></TradingLogSheet>
    </div>
  )
}

export default Home;