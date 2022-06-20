import Foundation

class ScaleWithBorderAnimator: Animator {
    var view: UIView
    var scaleAnimator: ScaleAnimator?
    var borderAnimator: BorderAnimator?
    var AnimProperty: AnimatorProperty
    
    required init(view: UIView, args: NSDictionary) {
        self.view = view
        self.scaleAnimator = ScaleAnimator(view: view, args: args)
        self.borderAnimator = BorderAnimator(view: view, args: args)
        self.AnimProperty = AnimatorProperty(args: args)
    }
    
    func onFocus(animated: Bool) {
        self.view.layer.zPosition = 999;
        UIView.transition(with: self.view, duration: AnimProperty.duration, options: .transitionCrossDissolve, animations: {
            self.view.transform = CGAffineTransform(scaleX: self.AnimProperty.scale, y: self.AnimProperty.scale)
            self.view.layer.borderColor = self.AnimProperty.borderColor
            self.view.layer.borderWidth = self.AnimProperty.borderWidth
        }, completion: nil)
    }

    func onBlur(animated: Bool) {
        self.view.layer.zPosition = self.AnimProperty.zIndex;
        UIView.transition(with: self.view, duration: AnimProperty.duration, options: .transitionCrossDissolve, animations: {
            self.view.transform = CGAffineTransform(scaleX: 1, y: 1)
            self.view.layer.borderWidth = 0
        }, completion: nil)
    }

    func addChildView(view: UIView) {
        
    }
}
