import Foundation

class ScaleAnimator: Animator {
    var view: UIView
    var AnimProperty: AnimatorProperty
    
    required init(view: UIView, args: NSDictionary) {
        self.view = view
        self.AnimProperty = AnimatorProperty(args: args)
    }
    
    func onFocus(animated: Bool) {
        UIView.animate(withDuration: self.AnimProperty.duration, delay: 0, options: [.curveEaseOut], animations: {
            self.view.transform = CGAffineTransform(scaleX: self.AnimProperty.scale, y: self.AnimProperty.scale)
        }, completion: nil)
    }
    
    func onBlur(animated: Bool) {
        UIView.animate(withDuration: self.AnimProperty.duration, delay: 0, options: [.curveEaseOut], animations: {
            self.view.transform =  CGAffineTransform(scaleX: 1, y: 1)
        }, completion: nil)
    }
    
    func addChildView(view: UIView) {
        
    }
}
