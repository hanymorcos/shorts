import { useQRCode } from "next-qrcode";
import React, { useState } from "react";

function App() {
const { Canvas } = useQRCode();
const [txt, setTxt ] = useState("");

const updateTxt = (event) => 
{
  setTxt(event.target.value);
}

return (
 <>
  <input type="text" value={txt}   onChange={updateTxt} />
    <br/>
    {txt? (
    <Canvas
      text={txt}
      options={{
        type: 'image/jpeg',
        quality: 0.3,
        level: 'M',
        margin: 3,
        scale: 4,
        width: 200,
        color: {
          dark: '#010599FF',
          light: '#FFBF60FF',
        },
      }}
    /> ) : <h1>Add Text for QR code</h1> }

 </>

)


}

export default App;