#import <Foundation/Foundation.h>
#import <Analytics/SEGIntegrationFactory.h>

@interface SEGMixpanelIntegrationFactory : NSObject <SEGIntegrationFactory>

+ (instancetype)instance;
+ (instancetype)createWithLaunchOptions:(NSString *)token launchOptions:(NSDictionary *)launchOptions;

@property NSDictionary *launchOptions;

@end

