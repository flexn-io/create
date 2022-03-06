import Foundation

class BorderAnimator: Animator {
    var view: UIView
    var borderWidth: CGFloat
    var borderStyle: String
    var duration: TimeInterval
    var borderColorFocus: CGColor = UIColor.red.cgColor;
    var borderColorBlur: CGColor? = nil;
    
    required init(view: UIView, args: NSDictionary) {
        self.view = view
        self.borderWidth = args["borderWidth"] as? CGFloat ?? 1
        self.borderStyle = args["borderStyle"] as? String ?? "solid"
        self.duration = args["duration"] as? TimeInterval ?? 0.5
        self.borderColorFocus = hexToColor(from: (args["colorFocus"] as? String ?? "").replacingOccurrences(of: "#", with: ""))
        self.borderColorBlur =  (args["colorBlur"] != nil) ? hexToColor(from: (args["colorBlur"] as? String ?? "").replacingOccurrences(of: "#", with: "")) : nil

    }
    
    func onFocus(animated: Bool) {
        if (animated) {
            UIView.transition(with: self.view, duration: self.duration, options: .transitionCrossDissolve, animations: {
                self.view.layer.borderColor = self.borderColorFocus
                self.view.layer.borderWidth = self.borderWidth
            }, completion: nil)
        } else {
            self.view.layer.borderColor = self.borderColorFocus
            self.view.layer.borderWidth = self.borderWidth
        }
    }
    
    func onBlur(animated: Bool) {
        if (animated) {
            UIView.transition(with: self.view, duration: self.duration, options: .transitionCrossDissolve, animations: {
                if (self.borderColorBlur != nil) {
                    self.view.layer.borderColor = self.borderColorBlur
                } else {
                    self.view.layer.borderWidth = 0
                }
            }, completion: nil)
        } else {
            if (self.borderColorBlur != nil) {
                self.view.layer.borderColor = self.borderColorBlur
            } else {
                self.view.layer.borderWidth = 0
            }
        }
    }
    
    func hexToColor(from hexString : String) -> CGColor {
        if let rgbValue = UInt(hexString, radix: 16) {
            let red   =  CGFloat((rgbValue >> 16) & 0xff) / 255
            let green =  CGFloat((rgbValue >>  8) & 0xff) / 255
            let blue  =  CGFloat((rgbValue      ) & 0xff) / 255
            
            return UIColor(red: red, green: green, blue: blue, alpha: 1.0).cgColor
        }
        
        return UIColor.red.cgColor
    }
    
    func rgbToColor(rgbValue: UInt, alpha: CGFloat = 1.0) -> CGColor {
        return UIColor(
            red: CGFloat((rgbValue & 0xFF0000) >> 16) / 255.0,
            green: CGFloat((rgbValue & 0x00FF00) >> 8) / 255.0,
            blue: CGFloat(rgbValue & 0x0000FF) / 255.0,
            alpha: CGFloat(alpha)
        ).cgColor
    }
    
    func addChildView(view: UIView) {
        
    }
}
