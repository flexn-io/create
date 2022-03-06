import Foundation

class ScaleWithBorderAnimator: Animator {
    var view: UIView
    var scaleAnimator: ScaleAnimator?
    var borderAnimator: BorderAnimator?
    var scale: CGFloat
    var duration: TimeInterval

    required init(view: UIView, args: NSDictionary) {
        self.view = view
        self.scaleAnimator = ScaleAnimator(view: view, args: args)
        self.borderAnimator = BorderAnimator(view: view, args: args)
        self.scale = args["scale"] as? CGFloat ?? 1.1
        self.duration = args["duration"] as? TimeInterval ?? 0.2
    }
    
    func onFocus(animated: Bool) {
        UIView.transition(with: self.view, duration: self.duration, options: .transitionCrossDissolve, animations: {
            self.view.transform = CGAffineTransform(scaleX: self.scale, y: self.scale)
            self.view.layer.borderColor = self.borderAnimator?.borderColorFocus
            self.view.layer.borderWidth = self.borderAnimator?.borderWidth ?? 1
        }, completion: nil)
    }
    
    func onBlur(animated: Bool) {
        UIView.transition(with: self.view, duration: self.duration, options: .transitionCrossDissolve, animations: {
            self.view.transform = CGAffineTransform(scaleX: 1, y: 1)
            self.view.layer.borderWidth = 0
        }, completion: nil)
    }
    
    func addChildView(view: UIView) {
        
    }
}
