import React, {useState} from 'react'
import Label from '../common/Label'
import { FileUpload, Input } from '../common/Input'
import { Row } from '../common/Row'
import DropdownInput from '../common/Dropdown'
import Button from '../common/Button'
import { coloreList } from '@/store/dropdown'
import { useAppState } from "@/context/app.context";


const Edit = () => {
  const [colore, setColore] = useState<string>("");
  const [bgRemove, setBgRemove] = useState<boolean>(false);
  const [magickErase, setMagickErase] = useState<boolean>(false);
  const [upScale, setupscale] = useState<boolean>(false);
  const [front, setFront] = useState<boolean>(true);
  const [back, setBack] = useState<boolean>(false);



    const {
       selectColore,
       setSelectedColore
      } = useAppState();
    
  return (
    <div className="accest">
            <div className="gap">
              <Row>
                <FileUpload></FileUpload>
              </Row>
            </div>
            <div className="gap">
              <Label>Arrange</Label>
              <div className="selectbox">
                <div className={ front ? "selectone ativeimg" :"selectone"} onClick={()=> setFront(!front)}>Bring to Front</div>
                <div className={ back ? "selectone ativeimg" :"selectone"} onClick={()=> setBack(!back)}>Send to back</div>
              </div>
            </div>

            <div className="gap">
              <Label>Color</Label>
              <div className="rowwothtwo">
                <DropdownInput data={{
              list: coloreList,
              label: "color",
              action: setSelectedColore,
              activeTab: selectColore,
            }}/>
                <div className="clolorpicker">
                  <div className="colorBox" style={{background: colore}}></div>
                  <Input onChange={(e)=> setColore(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="gap">
              <Label>Tools</Label>
              <div className="gap">
                <div className={bgRemove ?"selectTool ativeimg" :"selectTool"} onClick={()=> setBgRemove(!bgRemove)}>
                  <Label>Remove Background</Label>
                  <div>
                    <p>Remove the background of your image in one click</p>
                  </div>
                </div>
                <div className={magickErase ?"selectTool ativeimg" :"selectTool"} onClick={()=> setMagickErase(!magickErase)}>
                  <Label>Magic Erase</Label>
                  <div>
                    <p>Paint over objects to erase from the image</p>
                  </div>
                </div>
                <div className={upScale ?"selectTool ativeimg" :"selectTool"} onClick={()=> setupscale(!upScale)}>
                  <Label>Upscale</Label>
                  <div>
                    <p>Upscale image up to 2k resolution</p>
                  </div>
                </div>
              </div>
            </div>
            <Row>
              <Button>Download</Button>
            </Row>
          </div>
  )
}

export default Edit