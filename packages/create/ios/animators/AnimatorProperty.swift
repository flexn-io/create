//
//  AnimatorProperty.swift
//  FlexnCreate
//
//  Created by Aurimas Mickys on 2022-03-02.
//

import Foundation

class AnimatorProperty {
    var zIndex: CGFloat = 0
    
    var focusScale: CGFloat = 1.2
    var focusDuration: CGFloat = 0.15
    var focusBorderColor: CGColor?
    var focusBackgroundColor: UIColor?
    var focusBorderWidth: CGFloat = 1

    var blurScale: CGFloat = 1
    var blurDuration: CGFloat = 0.15
    var blurBorderColor: CGColor?
    var blurBackgroundColor: UIColor?
    var blurBorderWidth: CGFloat = 1

    init(args: NSDictionary) {
        if (args["focus"] != nil) {
            let focusValues: NSDictionary = args["focus"] as! NSDictionary
            
            if (focusValues["scale"] != nil) {
                self.focusScale = focusValues["scale"] as? CGFloat ?? 1.2
            }
            if (focusValues["duration"] != nil) {
                self.focusDuration = focusValues["duration"] as! Double / 1000
            }
            if (focusValues["borderColor"] != nil) {
                self.focusBorderColor = parseColor(from: focusValues["borderColor"] as! String)?.cgColor
            }
            if (focusValues["backgroundColor"] != nil) {
                self.focusBackgroundColor = parseColor(from: focusValues["backgroundColor"] as! String)
            }
            if (focusValues["borderWidth"] != nil) {
                self.focusBorderWidth = focusValues["borderWidth"] as! CGFloat
            }
        }
        
        if (args["blur"] != nil) {
            let focusValues: NSDictionary = args["blur"] as! NSDictionary
            
            if (focusValues["scale"] != nil) {
                self.blurScale = focusValues["scale"] as? CGFloat ?? 1
            }
            if (focusValues["duration"] != nil) {
                self.blurDuration = focusValues["duration"] as! Double / 1000
            }
            
            if (focusValues["borderColor"] != nil) {
                self.blurBorderColor = parseColor(from: focusValues["borderColor"] as! String)?.cgColor
            }
            if (focusValues["backgroundColor"] != nil) {
                self.blurBackgroundColor = parseColor(from: focusValues["backgroundColor"] as! String)
            }
            if (focusValues["borderWidth"] != nil) {
                self.blurBorderWidth = focusValues["borderWidth"] as! CGFloat
            }
        
        }
//        if ((self.style["zIndex"]) != nil) {
//            self.zIndex = (self.style["zIndex"] as? CGFloat)!
//        }
    }
    
    func parseColor(from colorString: String) -> UIColor? {
        
        switch colorString {
            case "black": return UIColor.black
            case "darkGray": return UIColor.darkGray
            case "lightGray": return UIColor.lightGray
            case "white": return UIColor.white
            case "gray": return UIColor.gray
            case "red": return UIColor.red
            case "green": return UIColor.green
            case "blue": return UIColor.blue
            case "cyan": return UIColor.cyan
            case "yellow": return UIColor.yellow
            case "magenta": return UIColor.magenta
            case "orange": return UIColor.orange
            case "purple": return UIColor.purple
            case "brown": return UIColor.brown
            default:
                ()
        }

        if (colorString.starts(with: "#")) {
            return hexToColor(from: colorString)
        }
        
        if (colorString.starts(with: "rgb")) {
//            return hexToColor(from: colorString)
        }
        
        return nil;
    }
    
    func hexToColor(from hexString : String) -> UIColor? {
        let hexString = hexString.replacingOccurrences(of: "#", with: "")

        if hexString.count == 8 {
            let scanner = Scanner(string: hexString)
            var hexNumber: UInt64 = 0

            if scanner.scanHexInt64(&hexNumber) {
                let r, g, b, a: CGFloat
                r = CGFloat((hexNumber & 0xff000000) >> 24) / 255
                g = CGFloat((hexNumber & 0x00ff0000) >> 16) / 255
                b = CGFloat((hexNumber & 0x0000ff00) >> 8) / 255
                a = CGFloat(hexNumber & 0x000000ff) / 255

                return UIColor(red: r, green: g, blue: b, alpha: a)

            }
        }
        
        if let rgbValue = UInt(hexString, radix: 16) {
            let red   =  CGFloat((rgbValue >> 16) & 0xff) / 255
            let green =  CGFloat((rgbValue >>  8) & 0xff) / 255
            let blue  =  CGFloat((rgbValue      ) & 0xff) / 255
            
            return UIColor(red: red, green: green, blue: blue, alpha: 1.0)
        }
        
        return nil
    }
    
    func rgbToColor(rgbValue: UInt, alpha: CGFloat = 1.0) -> UIColor {
        return UIColor(
            red: CGFloat((rgbValue & 0xFF0000) >> 16) / 255.0,
            green: CGFloat((rgbValue & 0x00FF00) >> 8) / 255.0,
            blue: CGFloat(rgbValue & 0x0000FF) / 255.0,
            alpha: CGFloat(alpha)
        )
    }
}
