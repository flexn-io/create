import Foundation

class BackgroundAnimator: Animator {
    var view: UIView
    var duration: TimeInterval
    var backgroundColorFocus: CGColor = UIColor.red.cgColor
    var backgroundColorBlur: CGColor = UIColor.red.cgColor

    required init(view: UIView, args: NSDictionary) {
        self.view = view
        self.duration = args["duration"] as? TimeInterval ?? 0.2
        let colorStringFocus = (args["colorFocus"] as? String ?? "").replacingOccurrences(of: "#", with: "")
        let colorStringBlur = (args["colorBlur"] as? String ?? "").replacingOccurrences(of: "#", with: "")
        self.backgroundColorFocus = hexToColor(from: colorStringFocus)
        self.backgroundColorBlur = hexToColor(from: colorStringBlur)
    }
    
    func onFocus(animated: Bool) {
        if (animated) {
            UIView.transition(with: self.view, duration: self.duration, options: .transitionCrossDissolve, animations: {
                self.view.layer.backgroundColor = self.backgroundColorFocus
            }, completion: nil)
        } else {
            self.view.layer.backgroundColor = self.backgroundColorFocus
        }
    }
    
    func onBlur(animated: Bool) {
        if (animated) {
            UIView.transition(with: self.view, duration: self.duration, options: .transitionCrossDissolve, animations: {
                self.view.layer.backgroundColor = self.backgroundColorBlur
            }, completion: nil)
        } else {
            self.view.layer.backgroundColor = self.backgroundColorBlur
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
    
    func addChildView(view: UIView) {
        
    }
}
