#import <Foundation/Foundation.h>
#import <Analytics/SEGIntegration.h>
#import <Mixpanel/Mixpanel.h>


@interface SEGMixpanelIntegration : NSObject <SEGIntegration>

@property (nonatomic, strong) NSDictionary *settings;
@property (nonatomic, strong) Mixpanel *mixpanel;

- (instancetype)initWithSettings:(NSDictionary *)settings andMixpanel:(Mixpanel *)mixpanel;

- (instancetype)initWithSettings:(NSDictionary *)settings andLaunchOptions:(NSDictionary *)launchOptions;

@end
