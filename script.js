
var pointPlayer_1=0;
var pointPlayer_2=0;

function createBoard()
{
    //creating board
    var board = document.getElementById('board');
    var rows =[0,1,2,3,4,5,6,7]
    for(var y=0; y<8;y++)
    {
        for(var x=0;x<8;x++)
        {
            var cell = document.createElement('div');
            if((x+y)%2)
            {
                cell.classList.add('black_field');
                cell.id = rows[x].toString()+y.toFixed();
                //cell.innerText= rows[x].toString()+y.toFixed();
                board.appendChild(cell);
                
            }
            else
            {
                cell.classList.add('white_field')
                cell.id = rows[x].toString()+y.toFixed() ;
                //cell.innerText=rows[x].toString()+y.toFixed();
                board.appendChild(cell);
            }       
            if(y<3 && cell.className == "black_field")
            {
                var img = document.createElement('img');
                img.className= "pawn";
                img.id = 'b' +rows[x].toString()+y.toFixed() ;
                img.src = "images/black.jpg";
                img.setAttribute("move", true);
                cell.appendChild(img);
            }
            else if(y>4 && cell.className=="black_field")
            {
                var img = document.createElement('img');
                img.className= "pawn";
                img.id = 'w' + rows[x].toString()+y.toFixed() ;
                img.src = "images/white.jpg";
                img.setAttribute("move", true);
                cell.appendChild(img);
            }
            cell.setAttribute("move", false);
            
        }
    }
}

function canDrop()
{
    var cells = document.querySelectorAll('.black_field');
    for(var i=0; i<cells.length; i++)
    {
        var x = cells[i];
        x.addEventListener('dragover', dragOver, false);
        x.addEventListener('drop', Drop, false);
        x.addEventListener('dragenter', dragEnter,false)
        x.addEventListener('dragleave', dragLeave,false);
        
    }
    var pawns = document.querySelectorAll('img');
    for(var i=0; i<pawns.length;i++)
    {
        var p = pawns[i];
        p.addEventListener('dragstart', startD, false);
        p.addEventListener('dragend', endD, false);
        
    } 
}
function Drop(e)
{
    e.stopPropagation();
    e.preventDefault();
    var droppedIDprevious =e.dataTransfer.getData("text");
    var droppedPawn = document.getElementById(droppedIDprevious);
   // console.log(droppedPawn);
    if(droppedPawn && e.target.tagName==="DIV" && isValidMove(droppedPawn, e.target, false) )
    {
        var newPawn = document.createElement('img');
        newPawn.src = droppedPawn.src;
        newPawn.id = droppedPawn.id.substr(0,1)+e.target.id;
        newPawn.draggable = droppedPawn.draggable; 
        if(droppedPawn.draggable)
        {
            newPawn.classList.add('jumpOnly');
        }
        newPawn.classList.add('pawn');  
        newPawn.addEventListener("dragstart", startD, false);
        newPawn.addEventListener("dragend", endD, false);
        e.target.appendChild(newPawn);
        droppedPawn.parentNode.removeChild(droppedPawn);
        King(newPawn);
    }

}
function dragOver(e)
{   
    e.preventDefault();
    var dragID = e.dataTransfer.getData("text");
    var dragPawn = document.getElementById(dragID);

    if (dragPawn)
    {
        if (e.target.tagName === "DIV" && isValidMove(dragPawn, e.target, false))
        {
            e.dataTransfer.dropEffect = "move";
        }
        else
        {
            e.dataTransfer.dropEffect = "none";
        }
  }
}
function dragEnter(e)
{
    var dragID = e.dataTransfer.getData("text");
    var dragPawn = document.getElementById(dragID);
    
    if(dragPawn && e.target.tagName ==="DIV" && isValidMove(dragPawn,e.target, false))
    {
        e.target.classList.add('drop');
    }
}
function dragLeave(e)
{
    e.target.classList.remove('drop');
}
function endD(e)
{
    e.target.classList.remove('selected');
}

function startD(e)//
{   
    if (e.target.draggable)
     {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text", e.target.id);
        e.target.classList.add('selected');
      }
}

function isValidMove(source, target, drop, pawn)
{
    var startPos = source.id.substr(1,2);
    var prefix = source.id.substr(0,1);
    var endPos = target.id;

    if(endPos.length>2)
    {
        endPos = endPos.substr(1,2);
    }

    if(target.childElementCount!=0)
    {               
        return false;
    }

    var jumpOnly = false;
    if(source.classList.contains("jumpOnly"))
    {
        jumpOnly = true;
    }

    var xStart  = parseInt(startPos.substr(0,1));
    var yStart = parseInt(startPos.substr(1,1));
    var xEnd = parseInt(endPos.substr(0,1));
    var yEnd = parseInt(endPos.substr(1,1));

    switch(prefix)// w zaleznosci od koloru pionka
    {
        case "b":
            if(yEnd <=yStart)
            return false;
        break;
        case "w":
            if(yEnd >=yStart) return false;
            break;
    }
    
    if(yStart===yEnd || xStart===xEnd )
    {
        return false;
    }
    
    if(Math.abs(yEnd-yStart)>2 || Math.abs(xEnd-xStart)>2)
    {
        return false;
    }

   if(Math.abs(xEnd - xStart)===1 && jumpOnly)
    {
        return false;
    }
    
    var jumped = false;
    var player1_Container = document.getElementById("p1");
    var player2_Container = document.getElementById("p2");
    
    if(Math.abs(xEnd- xStart)===2)
    {
        var position =((xStart + xEnd)/2).toString()+((yStart+yEnd)/2).toString();
        var div = document.getElementById(position);
        var img = div.children[0];
        if(img.id.substr(0,1).toLowerCase() === prefix.toLowerCase())
        {
            
            return false;
        }
        if(Drop)
        {
            if(img.id.substr(0,1)=="w")
            {
                pointPlayer_2+=1;
                player2_Container.textContent = pointPlayer_2;
            }
            else
            {
                pointPlayer_1+=1;
                player1_Container.textContent = pointPlayer_1;
            }
            div.removeChild(img);
            jumped=true;
            console.log(pointPlayer_1);
            console.log(pointPlayer_2);
        }

    }
    if(Drop)
    {   
        NextPlayer(source);
        if(jumped)
        {   
            source.draggable= true;
            source.classList.add("jumpOnly");
        }
    }
    

    
    return true;
}
createBoard();
canDrop();

function NextPlayer(pawn)
{
    var pawns = document.querySelectorAll('img');
    for(var i=0; i<pawns.length;i++)
    {
        var p = pawns[i];
        if(p.id.substr(0,1).toUpperCase()===pawn.id.substr(0,1).toUpperCase())
        {
            p.draggable = false;
        }
        else
        {
            p.draggable=true;
        }
        p.classList.remove("jumpOnly");
    }
}
function King(pawn)
{
    if(pawn.id.substr(0,1)==="W" || pawn.id.substr(0,1)==="B")
    {
        return;
    }
    var newPawn;
    //white
    if(pawn.id.substr(0,1)==="w" && pawn.id.substr(2,1)==="0")
    {
        newPawn=document.createElement("img");
        newPawn.src = "images/whiteK.jpg";
        newPawn.id = "W"+pawn.id.substr(1,2);
    }
    //black
    if(pawn.id.substr(0,1)==="b" && pawn.id.substr(2,1)==="7")
    {
        newPawn=document.createElement("img");
        newPawn.src = "images/blackK.jpg";
        newPawn.id = "B"+pawn.id.substr(1,2);
    }

    if(newPawn)
    {
        newPawn.draggable = true;
        newPawn.classList.add("pawn");
        newPawn.addEventListener('dragstart', startD,false);
        newPawn.addEventListener('dragend', endD,false);
        var parent =pawn.parentNode;
        parent.removeChild(pawn);
        parent.appendChild(newPawn);
    }


}