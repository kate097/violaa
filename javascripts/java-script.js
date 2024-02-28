document.addEventListener("DOMContentLoaded", function() {
    let elementsList = {};
    let cameraPos = 0;

    function coordinateFinder(elementId) {
        var el = document.getElementById(elementId);
        var rect = el.getBoundingClientRect();
        console.log("Координаты", elementId, ":", rect.top, rect.left);
        return [rect.left, rect.top];
      };

      function mouseFinder(event) {
        const x = event.clientX; 
        const y = event.clientY;
        let mousePosition = [x, y];
        return mousePosition;

      };

    let listOfEyes = document.querySelectorAll("img.eye");
    console.log(listOfEyes)
    for (let i = 1; i < listOfEyes.length + 1; i++) {
        let idOfEye = "eye" + i;
        console.log(idOfEye)
        coordinates = coordinateFinder(idOfEye);
        elementsList[idOfEye] = coordinates;



        var el = document.getElementById(idOfEye);
        var st = window.getComputedStyle(el, null);
        var tr = st.getPropertyValue("-webkit-transform") ||
                 st.getPropertyValue("-moz-transform") ||
                 st.getPropertyValue("-ms-transform") ||
                 st.getPropertyValue("-o-transform") ||
                 st.getPropertyValue("transform") ||
                 "FAIL";
               // With rotate(30deg)...
             // matrix(0.866025, 0.5, -0.5, 0.866025, 0px, 0px)
        console.log('Matrix: ' + tr);
        if (tr != "none") {
          var values = tr.split('(')[1].split(')')[0].split(',');
          var a = values[0];
          var b = values[1];
          var c = values[2];
          var d = values[3];
          var scale = Math.sqrt(a * a + b * b);
          var sin = b / scale;
          var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
          console.log('Rotate: ' + angle + 'deg');
          elementsList[idOfEye].push(angle);
        }
    }

    console.log(elementsList)

    window.onload = function() {
      function calcDistance(x1, y1, x2, y2) {
        return Math.sqrt((x1-x2)**2 + (y1-y2)**2);
      }

      function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function back(elem) {
        $("#" + elem).css({
          left: elementsList[elem][0],
          top: elementsList[elem][1]
        })
      return false
    }

    function animate(elem, yX, yY, angle) {
      
    
      let angle1 = `rotate(${angle}deg)`; 
      let angle2 = `rotate(${angle + 10}deg)`; 
      const obj = document.querySelector("#" + elem);
      const animation = [
        { transform: angle1 },
        { transform: angle2 },
        { transform: angle1 },
      ];

      const time = {
        duration: 500,
        iterations: Infinity,
      };
      obj.animate(animation, time);
    }
    

      function moveEye(mX, mY, yX, yY, eyeId) {
        bj = document.getElementById(eyeId);
        let px = 100 / window.innerWidth;
        $(document).on('mousemove', function (e) {
          let left = 0;
          let top = 0;
          if (mX > yX) {
            left = (e.pageX - 100);
          } else  {
            left = (e.pageX + 100);
          }

          if (mY > yY) {
            top = (e.pageY - 100);
          } else  {
            top = (e.pageY + 100);
          }

          $("#" + eyeId).css({
            left: left,
            top: top
          })
          $(document).off('mousemove');
      })
      return ;
    }

      function checker(mouse) {
        minDistance = 100;
        flag = 0;
        for (let elem in elementsList) {
          const distance = calcDistance(mouse[0], mouse[1], elementsList[elem][0], elementsList[elem][1]);
          if (distance < minDistance) {
            flag = elem;
            moveEye(mouse[0], mouse[1], elementsList[elem][0], elementsList[elem][1], elem);
            if (elementsList[elem].length = 3) {
              if (elementsList[elem][2] != "empty" && elementsList[elem][2] != NaN && elementsList[elem][2] != undefined) {
                animate(elem, elementsList[elem][0], elementsList[elem][1], elementsList[elem][2])
              } else {
                elementsList[elem].push(getRandomInt(0, 360));
              }
            } else {
              elementsList[elem].push(getRandomInt(0, 360));
            }
          }
          else {
            back(elem);
          }
        }
      };

      document.addEventListener('mousemove', function (event) {
          let mouse = mouseFinder(event);
          checker(mouse);
      });

      document.addEventListener('scroll', function (event) {
        let eyes = document.getElementById("eyesBlock");
        let posTop = eyes.getBoundingClientRect().top;
        if (posTop < -200) {
          eyes.style.display="none";
          console.log("fdfdfdfddsdsdsdsdsdsf", posTop)
        } else {
          console.log("fdrdsf", posTop)
        }

        
      });

    }
})