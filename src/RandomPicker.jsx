import "./RandomPicker.css"

export default function RandomPicker(){    

    const cbxRecHandle = (e)=>{
        const recDat = document.getElementById("recorded-data");
        if(e.target.checked){
            recDat.style.display = "block";
        }else{
            recDat.style.display = "none";
        }
        recDat.value = "Choosen: ";
    }
    
    const btnGoHandle = (e)=>{
        const recDat = document.getElementById("recorded-data");
        const txtArea = document.getElementById("inp-data");
        const msg = document.getElementById("msg");
        const cbxDel = document.getElementById("cbx-chodel");
        const cbxRec = document.getElementById("cbx-chorec");
        let data = txtArea.value.split("\n");
        let intv;let autoGo = false;let speedUp=false;
        let hasCommand = false;let loopSig = 700;
        let curIdx = -1; // prevent get same idx
        if(data.length<2){
            return;
        }
        if(data[data.length-1].length===0){ // apus /n diakhir
            data.pop();
        }
        if(data[0].includes("AUTO_GO")){
            hasCommand = true;
            autoGo=true;
        }
        if(data[0].includes("SPEED_UP")){
            hasCommand = true;
            speedUp = true;
            loopSig = 110;
        }
        if(hasCommand){
            data.shift();
            txtArea.value = data.join("\n");
            data = txtArea.value.split("\n");
            if(data[data.length-1].length===0){ // apus /n diakhir
                data.pop();
            }
        }
        function togleDisable(){
            txtArea.toggleAttribute('disabled')
            cbxDel.toggleAttribute('disabled');
            cbxRec.toggleAttribute('disabled');
            e.target.toggleAttribute('disabled');
        }
        function randPick(){
            let choosenIdx;
            while(true){
                choosenIdx = Math.floor(Math.random()*data.length);
                if(!(choosenIdx===curIdx)){curIdx = choosenIdx;break;}
            }
            msg.textContent = data[choosenIdx];
            msg.style.backgroundColor = `rgb(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})`
        }
        function sleep(milis){
            return new Promise((res,rej)=>{
                setTimeout(()=>{
                    res();
                }, milis)
            })
        }
        function clear(){
            return new Promise((res,rej)=>{
                clearInterval(intv);
                res();
            })
        }
        function preShuffle(){
            for(let i=data.length-1;i>0;i--){
                let shufIdx = Math.floor(Math.random()*data.length);
                [data[shufIdx], data[i]] = [data[i], data[shufIdx]]
            }
        }
        async function ubahInterval(milis){
            await clear();
            return new Promise((res,rej)=>{
                intv = setInterval(randPick,milis)
                res();
            })
        }
        async function mainFunc(){
            intv = setInterval(randPick, 10);
            preShuffle();
            for(let i=100;i<loopSig;i+=100){
                if(!speedUp){
                    await ubahInterval(i);
                    await sleep(i+500);
                }else{
                    await ubahInterval(50);
                    await sleep(500);
                }
            }
            await clear();
            endFunc();
        }
        function endFunc(){
            if(cbxRec.checked){
                let dat = recDat.value.split("\n");
                let newdat = `${dat.length}. ${msg.textContent}`
                recDat.value+=`\n${newdat}`;
            }
            if(cbxDel.checked){
                let deleted = false;
                let newdata = [];
                let chosdat = msg.textContent;
                for(let i=0;i<data.length;i++){
                    if(chosdat===data[i]&&!deleted){
                        deleted = true;
                    }else{
                        newdata.push(data[i]);
                    }
                }
                txtArea.value = newdata.join("\n");
            }
            data = txtArea.value.split("\n");
            if(data.length===1){
                let dat = recDat.value.split("\n");
                let newdat = `${dat.length}. ${data[0]}`
                recDat.value+=`\n${newdat}`;
                txtArea.value = "";
            }
            if(autoGo&&data.length>1&&cbxDel.checked){
                mainFunc();
            }else{
                togleDisable();
            }
        }
        togleDisable()
        mainFunc();
    }
    return(
        <>  
            <div className="base">
                <h2 id="msg">?</h2>
                <div className="control">
                    <div>
                        <input type="checkbox" name="delete-choosen" id="cbx-chodel" />
                        <label>Delete choosen</label>
                    </div>
                    <button onClick={btnGoHandle}>Go</button>
                    <div>
                        <input onClick={cbxRecHandle} type="checkbox" name="record-choosen" id="cbx-chorec" />
                        <label>Record choosen</label>
                    </div>
                </div>
                <div className="data">
                    <textarea id="inp-data" cols="30" rows="10" placeholder="Input data to be random pick here, separated by enter"></textarea>
                    <textarea id="recorded-data" cols="30" rows="10" disabled></textarea>
                </div>
            </div>
        </>
    )
}