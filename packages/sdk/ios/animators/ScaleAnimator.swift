import Foundation

class ScaleAnimator: Animator {
    var view: UIView
    var scale: CGFloat
    var duration: TimeInterval
    
    required init(view: UIView, args: NSDictionary) {
        self.view = view
        self.scale = args["scale"] as? CGFloat ?? 1.1
        self.duration = args["duration"] as? TimeInterval ?? 0.2
    }
    
    func onFocus(animated: Bool) {
        UIView.animate(withDuration: self.duration, delay: 0, options: [.curveEaseOut], animations: {
            self.view.transform = CGAffineTransform(scaleX: self.scale, y: self.scale)
        }, completion: nil)
    }
    
    func onBlur(animated: Bool) {
        UIView.animate(withDuration: self.duration, delay: 0, options: [.curveEaseOut], animations: {
            self.view.transform =  CGAffineTransform(scaleX: 1, y: 1)
        }, completion: nil)
    }
    
    func addChildView(view: UIView) {
        
    }
}
