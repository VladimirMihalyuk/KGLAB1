
var utils = {
  
    XYZ2RGB: function(xyz){
      let x = parseFloat(xyz[0]) / 100;
      let y = parseFloat(xyz[1]) / 100;
      let z = parseFloat(xyz[2]) / 100;
      let rn = (3.2406 * x) - (1.5372 * y)  - (0.4986 * z);
      let gn = (-0.9689 * x) + (1.8758 * y) +  (0.0415 * z);
      let bn = (0.0557 * x) - (0.2040 * y) +  (1.0570 * z);
      rn = FXYZ2RGB(rn);
      gn = FXYZ2RGB(gn);
      bn = FXYZ2RGB(bn);
      let r = Math.min(Math.max(rn, 0), 1)  * 255;
      let g = Math.min(Math.max(gn, 0), 1) * 255;
      let b = Math.min(Math.max(bn, 0), 1) * 255;
      return [r, g, b];
    }, 
    Lab2XYZ: function(lab){
      let l = parseFloat(lab[0])
      let a = parseFloat(lab[1])
      let b = parseFloat(lab[2])
      let Yvalue = FLab2XYZ((l + 16.0) / 116.0) * 100.0;
      let Xvalue = FLab2XYZ(a / 500.0  + (l + 16.0) / 116.0) * 95.0489;
      let zarg = ((l + 16.0) / 116.0 - b / 200.0) 
      let Zvalue =  FLab2XYZ(zarg) * 108.8840
      
      return [Xvalue, Yvalue, Zvalue];
    },

    RGB2XYZ: function(rgb){
      let Rn = FRGB2XYZ(parseFloat(rgb[0]) / 255) * 100;
      let Gn = FRGB2XYZ(parseFloat(rgb[1]) / 255) * 100;
      let Bn = FRGB2XYZ (parseFloat(rgb[2]) / 255) * 100;
      let X = 0.412453 * Rn + 0.357580 * Gn + 0.180423 * Bn;
      let Y = 0.212671 * Rn + 0.715160 * Gn + 0.072169 * Bn;
      let Z = 0.019334 * Rn + 0.119193 * Gn + 0.950227 * Bn;
     
      return [X, Y, Z]
 
    },

    XYZ2LAB: function(xyz){
      let L = 116 * FXYZ2Lab(parseFloat(xyz[1]) / 100) - 16;
      let a = 500 * (FXYZ2Lab(parseFloat(xyz[0]) / 95.0489) - FXYZ2Lab(parseFloat(xyz[1]) / 100));
      let b = 200 * (FXYZ2Lab(parseFloat(xyz[1]) / 100) - FXYZ2Lab(parseFloat(xyz[2]) / 108.8840));
      return [L, a, b];
    },

    HSL2RGB: function(hsl){
      let h =  parseFloat(hsl[0]);
      let s =  parseFloat(hsl[1]);
      let l =  parseFloat(hsl[2]);
      let q;
      if(l < 0.5){
        q = l * (1.0 + s);
      }else{
        q = l + s - l * s;
      }
      let p = 2.0 * l - q;
      let hk = h / 360;
      tr = hk + 1/3;
      tg = hk;
      tb = hk - 1/3;
      let t = [tr, tg, tb];
      for (let i = 0; i < 3; i++) {
        if(t[i] < 0){
          t[i] += 1.0;
        }
        if(t[i] > 1){
          t[i] -= 1.0;
        }
      }

      let rgb = [0.0, 0.0, 0.0];
      for (let i = 0; i < 3; i++) {
        if(t[i] < 1/6){
          rgb[i] = p + ((q - p) * 6.0 * t[i]);
        }else{
          if(t[i] < 1/2){
            rgb[i] = q;
          }else{
            if(t[i] < 2/3){
              rgb[i] = p + (q - p) * (2/3 - t[i]) * 6.0;
            }else{
              rgb[i] = p;
            }
          }
        }

        rgb[i] *= 255;
      }
      return rgb;
    },

    RGB2HSL: function(rgb){
      let r = parseFloat(rgb[0]) / 255;
      let g = parseFloat(rgb[1]) / 255;
      let b = parseFloat(rgb[2]) / 255;
      let min = Math.min(r, g, b);
      let max = Math.max(r, g, b);
      let h;
      if(max == r && g >= b){
        h = 60.0 * (g - b) / (max - min);
      }else{
        if(max == r && g < b){
          h = 60.0 * (g - b) / (max - min) + 360;
        }else{
          if(max == g){
            h = 60.0 * (b - r) / (max - min) + 120;
          }else{
            if(max == b){
              h = 60.0 * (r - g) / (max - min) + 240;
            }
          }
        }
      }

      let l = 1/2 * (max + min);
      let s = (max - min)/(1 - Math.abs(1 - (max + min)))
      return [h, s, l]
    }
};

function FXYZ2RGB(x){
  if(x >= 0.0031308){
    return Math.pow(1.055 * x, 1 / 2.4 ) - 0.055;
  }else{
    return 12.92 * x;
  }
};

function FRGB2XYZ(x){
  if(x >= 0.04045){
    return Math.pow((x + 0.055) / 1.055, 2.4);
  }else{
    return x / 12.92;
  }
};

let sigma = 6.0/29.0

function FLab2XYZ(x){
  if(Math.pow(x, 3) > sigma){
    return Math.pow(x, 3);
  }else{
    return 3 * Math.pow(sigma, 2) * (x - 4.0/ 29.0);
  }
};

function FXYZ2Lab(x){
  if(x > Math.pow(sigma, 3)){
    return Math.pow(x, 1/3);
  }else{
    return x/(3 * Math.pow(sigma,2) ) + 4/29;
  }
}

