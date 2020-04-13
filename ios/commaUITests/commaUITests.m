//
//  commaUITests.m
//  commaUITests
//
//  Created by Bruce Wayne on 3/12/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <XCTest/XCTest.h>
#import "commaUITests-Swift.h"
@interface commaUITests : XCTestCase

@end

@implementation commaUITests
{
  XCUIApplication *app;
}
- (void)setUp {
    self.continueAfterFailure = NO;

    self->app = [[XCUIApplication alloc] init];
    
    [Snapshot setupSnapshot:self->app waitForAnimations:false];
    [self->app launch];
}
- (void)waitForElementToAppear:(XCUIElement *)element withTimeout:(NSTimeInterval)timeout
{
  NSUInteger line = __LINE__;
  NSString *file = [NSString stringWithUTF8String:__FILE__];
  NSPredicate *existsPredicate = [NSPredicate predicateWithFormat:@"exists == true"];
  
  [self expectationForPredicate:existsPredicate evaluatedWithObject:element handler:nil];
  
  [self waitForExpectationsWithTimeout:timeout handler:^(NSError * _Nullable error) {
    if (error != nil) {
      NSString *message = [NSString stringWithFormat:@"Failed to find %@ after %f seconds",element,timeout];
      [self recordFailureWithDescription:message inFile:file atLine:line expected:YES];
    }
  }];
}
- (void)tearDown {
    // Put teardown code here. This method is called after the invocation of each test method in the class.
}

- (void)testScreenshots {
  // DeviceMap shot
  [Snapshot snapshot:@"Launch" timeWaitingForIdle:30];
  XCUIApplication *springboard  = [[XCUIApplication alloc] performSelector:@selector(initPrivateWithPath:bundleID:)
      withObject:nil
      withObject:@"com.apple.springboard"];
  XCUIElement *locAllowBtn = [[springboard.buttons matchingIdentifier:@"Allow While Using App"] element];
  if (locAllowBtn.exists) {
    [locAllowBtn tap];
  }

  XCUIElement *sheet = [[[self->app otherElements] matchingIdentifier:@"DeviceMap-sheet"] element];
  [self waitForElementToAppear:sheet withTimeout:60];
  [NSThread sleepForTimeInterval:5];
  [Snapshot snapshot:@"DeviceMap" timeWaitingForIdle:30];
  [sheet gentleSwipe:directionUp];
  [Snapshot snapshot:@"DeviceMap_Expanded" timeWaitingForIdle:30];
  
  // DeviceInfo shot
  XCUIElement *device = [[[self->app otherElements] matchingIdentifier:@"DeviceMap-sheet-device-0"] element];
  [self waitForElementToAppear:device withTimeout:10];
  [device pressForDuration:0.01];
  
  XCUIElement *deviceInfo = [[[self->app otherElements] matchingIdentifier:@"DeviceInfo"] element];
  [self waitForElementToAppear:deviceInfo withTimeout:10];
  [NSThread sleepForTimeInterval:5];
  [Snapshot snapshot:
   @"DeviceInfo" timeWaitingForIdle:10];
  
  // Drive shot
  XCUIElement *driveListItem = [[[self->app otherElements] matchingIdentifier:@"DriveList-drive-1"] element];
  [self waitForElementToAppear:driveListItem withTimeout:10];
  // TODO why is app not idling here? 
  [self disableWaitForIdle];
  [driveListItem pressForDuration:0.05];
  
  XCUIElement *drive = [[[self->app otherElements] matchingIdentifier:@"Drive"] element];
  [self waitForElementToAppear:drive withTimeout:10];
  [NSThread sleepForTimeInterval:5];
  [Snapshot snapshot:
   @"Drive" timeWaitingForIdle:10];
}

- (void)disableWaitForIdle {
  
  SEL originalSelector = NSSelectorFromString(@"waitForQuiescenceIncludingAnimationsIdle:");
  SEL swizzledSelector = @selector(doNothing);
  
  Method originalMethod = class_getInstanceMethod(objc_getClass("XCUIApplicationProcess"), originalSelector);
  Method swizzledMethod = class_getInstanceMethod([self class], swizzledSelector);
  
  method_exchangeImplementations(originalMethod, swizzledMethod);
}

- (void)doNothing {
  // no-op
}
@end
