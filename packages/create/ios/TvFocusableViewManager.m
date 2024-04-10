#import "React/RCTViewManager.h"
#if TARGET_OS_TV
#import "React/RCTTVView.h"
#else
#import <React/RCTView.h>
#endif

#if TARGET_OS_TV
@interface TvFocusableView : RCTTVView
    @property (nonatomic, assign) NSDictionary *animatorOptions;
    @property (nonatomic, assign) BOOL *isTVSelectable;
@end
#else
@interface TvFocusableView : RCTView

@end
#endif

#if TARGET_OS_TV
@interface RCT_EXTERN_MODULE(TvFocusableViewManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(animatorOptions, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(isTVSelectable, BOOL)

RCT_EXTERN_METHOD(
    cmdFocus: (nonnull NSNumber *)node
)
RCT_EXTERN_METHOD(
    cmdBlur: (nonnull NSNumber *)node
)

@end
#endif