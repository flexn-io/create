//
//  AnimatorProperty.swift
//  FlexnSDK
//
//  Created by Aurimas Mickys on 2022-03-02.
//

import Foundation

class AnimatorProperty {
    var style: NSDictionary
    var duration: TimeInterval = 0.15
    var scale: CGFloat = 1.2
    var borderColor: CGColor?
    var backgroundColor: UIColor?
    var borderWidth: CGFloat = 1
    var zIndex: CGFloat = 0
    var backgroundColorFocus: UIColor?

    init(args: NSDictionary) {
        self.style = args["style"] as! NSDictionary
        self.scale = args["scale"] as? CGFloat ?? 1.2
        
        if ((args["duration"]) != nil) {
            self.duration = args["duration"] as! Double / 100
        }
        if ((args["backgroundColorFocus"]) != nil) {
            self.backgroundColorFocus = hexToColor(from: args["backgroundColorFocus"] as! String)
        }
        if ((self.style["borderColor"]) != nil) {
            self.borderColor = hexToColor(from: self.style["borderColor"] as! String).cgColor
        }
        if ((self.style["backgroundColor"]) != nil) {
            self.backgroundColor = hexToColor(from: self.style["backgroundColor"] as! String)
        }
        if ((self.style["borderWidth"]) != nil) {
            self.borderWidth = (self.style["borderWidth"] as? CGFloat)!
        }
        if ((self.style["zIndex"]) != nil) {
            self.zIndex = (self.style["zIndex"] as? CGFloat)!
        }
    }
    
    func hexToColor(from hexString : String) -> UIColor {
        let hexString = hexString.replacingOccurrences(of: "#", with: "")

        if let rgbValue = UInt(hexString, radix: 16) {
            let red   =  CGFloat((rgbValue >> 16) & 0xff) / 255
            let green =  CGFloat((rgbValue >>  8) & 0xff) / 255
            let blue  =  CGFloat((rgbValue      ) & 0xff) / 255
            
            return UIColor(red: red, green: green, blue: blue, alpha: 1.0)
        }
        
        return UIColor.red
    }
    
    func rgbToColor(rgbValue: UInt, alpha: CGFloat = 1.0) -> CGColor {
        return UIColor(
            red: CGFloat((rgbValue & 0xFF0000) >> 16) / 255.0,
            green: CGFloat((rgbValue & 0x00FF00) >> 8) / 255.0,
            blue: CGFloat(rgbValue & 0x0000FF) / 255.0,
            alpha: CGFloat(alpha)
        ).cgColor
    }
}
