// Copyright (c) 2021 Microsoft. All rights reserved.
// Use of this source code is governed by the MIT license that can be
// found in the LICENSE file.

#include "shell/browser/file_select_helper.h"

#include "testing/gtest/include/gtest/gtest.h"

namespace electron {

TEST(FileSelectHelperTest, IsAcceptTypeValid) {
  // Valid extensions
  EXPECT_TRUE(FileSelectHelper::IsAcceptTypeValid(".jpg"));
  EXPECT_TRUE(FileSelectHelper::IsAcceptTypeValid(".txt"));
  EXPECT_TRUE(FileSelectHelper::IsAcceptTypeValid(".tar.gz"));

  // Valid MIME types
  EXPECT_TRUE(FileSelectHelper::IsAcceptTypeValid("image/png"));
  EXPECT_TRUE(FileSelectHelper::IsAcceptTypeValid("application/json"));
  EXPECT_TRUE(FileSelectHelper::IsAcceptTypeValid("video/*"));
  EXPECT_TRUE(FileSelectHelper::IsAcceptTypeValid("text/plain"));

  // Invalid: too short
  EXPECT_FALSE(FileSelectHelper::IsAcceptTypeValid("."));
  EXPECT_FALSE(FileSelectHelper::IsAcceptTypeValid("/"));
  EXPECT_FALSE(FileSelectHelper::IsAcceptTypeValid("a"));

  // Invalid: case sensitivity (must be lowercase)
  EXPECT_FALSE(FileSelectHelper::IsAcceptTypeValid(".JPG"));
  EXPECT_FALSE(FileSelectHelper::IsAcceptTypeValid("Image/Png"));

  // Invalid: whitespace
  EXPECT_FALSE(FileSelectHelper::IsAcceptTypeValid(" .jpg"));
  EXPECT_FALSE(FileSelectHelper::IsAcceptTypeValid(".jpg "));
  EXPECT_FALSE(FileSelectHelper::IsAcceptTypeValid("image/ png"));

  // Invalid: Extension with slash
  EXPECT_FALSE(FileSelectHelper::IsAcceptTypeValid(".jpg/"));
  EXPECT_FALSE(FileSelectHelper::IsAcceptTypeValid("./jpg"));

  // Invalid: MIME type issues
  EXPECT_FALSE(FileSelectHelper::IsAcceptTypeValid("image")); // No slash
  EXPECT_FALSE(FileSelectHelper::IsAcceptTypeValid("/image")); // Starts with slash
  EXPECT_FALSE(FileSelectHelper::IsAcceptTypeValid("image/")); // Ends with slash
  EXPECT_FALSE(FileSelectHelper::IsAcceptTypeValid("image//png")); // Double slash
  EXPECT_FALSE(FileSelectHelper::IsAcceptTypeValid("image/png;charset=utf-8")); // Has parameters
}

}  // namespace electron
