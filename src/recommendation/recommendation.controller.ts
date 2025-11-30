import { UseGuards, Controller, Patch, Param, Body } from '@nestjs/common';
import { RecommendationsService } from './recommendation.service';
import { JwtAuthGuard } from 'src/user/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdatePreferenceDto } from './dto/update-preference.dto';

@ApiTags('Recommendation API')
@Controller('recommendation')
export class RecommendationController {
  constructor(private readonly recsService: RecommendationsService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('user/:userId')
  async updatePreference(
    @Param('userId') userId: string,
    @Body() dto: UpdatePreferenceDto,
  ) {
    await this.recsService.updateField(
      userId,
      dto.field,
      dto.value,
      dto.action,
    );
    return { message: 'Preferences updated' };
  }
}
